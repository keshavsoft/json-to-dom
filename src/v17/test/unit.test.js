import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lightweight DOM mock for Node test environment mimicking browser DOM
class MockTextNode {
    constructor(text) {
        this.nodeType = 3;
        this.textContent = text;
    }
}

class MockNamedNodeMap {
    constructor() {
        this._map = {};
    }
    setNamedItem(name, value) {
        this._map[name] = { name, value: String(value) };
    }
    removeNamedItem(name) {
        delete this._map[name];
    }
    getNamedItem(name) {
        return this._map[name] || null;
    }
    [Symbol.iterator]() {
        return Object.values(this._map)[Symbol.iterator]();
    }
    get length() {
        return Object.keys(this._map).length;
    }
}

class MockElement {
    constructor(tagName) {
        this.nodeType = 1;
        this.tagName = tagName.toUpperCase();
        this.className = "";
        this.dataset = {};
        this.attributes = new MockNamedNodeMap();
        this.childNodes = [];
        this._textContent = "";
    }

    get textContent() {
        if (this.childNodes.length === 1 && this.childNodes[0].nodeType === 3) {
            return this.childNodes[0].textContent;
        }
        if (this.childNodes.length > 0) {
            return this.childNodes.map((c) => c.textContent || "").join("");
        }
        return this._textContent;
    }

    set textContent(val) {
        this._textContent = String(val);
        this.childNodes = val ? [new MockTextNode(String(val))] : [];
    }

    get children() {
        return this.childNodes.filter((child) => child.nodeType === 1);
    }

    setAttribute(key, value) {
        this.attributes.setNamedItem(key, value);
    }

    getAttribute(key) {
        return this.attributes.getNamedItem(key)?.value ?? null;
    }

    removeAttribute(key) {
        this.attributes.removeNamedItem(key);
    }

    appendChild(child) {
        this.childNodes.push(child);
        return child;
    }

    append(...children) {
        for (const child of children) {
            this.appendChild(child);
        }
    }
}

class MockDocument {
    createElement(tagName) {
        return new MockElement(tagName);
    }
    createTextNode(text) {
        return new MockTextNode(text);
    }
}

globalThis.document = new MockDocument();

import {
    buildSpecElement,
    domToSpec
} from "../index.js";

describe("src/v16 Direct spec.json DOM Engine Tests", () => {
    let specJson;

    before(() => {
        const specPath = path.resolve(__dirname, "../samples/spec.json");
        specJson = JSON.parse(fs.readFileSync(specPath, "utf-8"));
    });

    test("spec.json is loaded and valid", () => {
        assert.ok(specJson, "spec.json must exist and be valid JSON");
        assert.equal(specJson.tagName, "div");
        assert.ok(Array.isArray(specJson.children), "spec.json must have children");
        assert.equal(specJson.children.length, 2);
    });

    test("buildSpecElement renders spec.json root element without dropping any nodes", () => {
        const dom = buildSpecElement({ inSpec: specJson, inShowLog: true });
        assert.ok(dom, "DOM element should be generated");
        assert.equal(dom.tagName, "DIV");
        assert.equal(dom.className, specJson.props.className);
        assert.equal(dom.children.length, 2, "Root container must preserve both sections");
    });

    test("Header section contains h1 and p with exact text and classes", () => {
        const dom = buildSpecElement({ inSpec: specJson });
        const header = dom.children[0];

        assert.equal(header.tagName, "DIV");
        assert.equal(header.children.length, 2);

        const h1 = header.children[0];
        assert.equal(h1.tagName, "H1", "h1 tag must NOT be dropped");
        assert.equal(h1.textContent, "Team Directory");
        assert.equal(h1.className, "text-2xl font-bold text-slate-900 dark:text-white tracking-tight");

        const p = header.children[1];
        assert.equal(p.tagName, "P");
        assert.equal(p.textContent, "Showing 3 team members (Updated 2026-09-12)");
    });

    test("Member list renders all 3 member cards with images, names, roles, and status badges", () => {
        const dom = buildSpecElement({ inSpec: specJson });
        const memberList = dom.children[1];

        assert.equal(memberList.tagName, "DIV");
        assert.equal(memberList.children.length, 3, "All 3 team members must be rendered");

        const expectedMembers = [
            { name: "Alex Morgan", seed: "Alex", status: "Active" },
            { name: "Sarah Connor", seed: "Sarah", status: "Active" },
            { name: "David Bowman", seed: "David", status: "On Leave" }
        ];

        expectedMembers.forEach((expected, index) => {
            const card = memberList.children[index];
            assert.equal(card.tagName, "DIV");

            // Left side wrapper (avatar + text)
            const leftCol = card.children[0];
            const img = leftCol.children[0];
            const expectedAlt = specJson.children[1].children[index].children[0].children[0].props.alt;
            assert.equal(img.tagName, "IMG", "img tag must NOT be dropped");
            assert.equal(img.getAttribute("alt"), expectedAlt);
            assert.ok(img.getAttribute("src").includes(`seed=${expected.seed}`));

            // Name span
            const textCol = leftCol.children[1];
            const nameSpan = textCol.children[0];
            assert.equal(nameSpan.tagName, "SPAN", "span tag must NOT be dropped");
            assert.equal(nameSpan.textContent, expected.name);

            // Status badge span
            const badgeSpan = card.children[1];
            assert.equal(badgeSpan.tagName, "SPAN");
            assert.equal(badgeSpan.textContent, expected.status);
            assert.equal(badgeSpan.dataset.status, expected.status, "dataset.status must be preserved");
        });
    });

    test("domToSpec correctly reverses rendered DOM back to a compliant specification", () => {
        const dom = buildSpecElement({ inSpec: specJson });
        const reversed = domToSpec({ inNode: dom });

        assert.ok(reversed);
        assert.equal(reversed.tagName, "div");
        assert.equal(reversed.attributes.class, specJson.props.className);
        assert.equal(reversed.children.length, 2);

        // Header check
        const headerReversed = reversed.children[0];
        assert.equal(headerReversed.children[0].tagName, "h1");
        assert.equal(headerReversed.children[0].textContent, "Team Directory");

        // First member check
        const firstMember = reversed.children[1].children[0];
        const firstImg = firstMember.children[0].children[0];
        const expectedFirstAlt = specJson.children[1].children[0].children[0].children[0].props.alt;
        assert.equal(firstImg.tagName, "img");
        assert.equal(firstImg.attributes.alt, expectedFirstAlt);
        assert.equal(firstImg.attributes.src, "https://api.dicebear.com/7.x/bottts/svg?seed=Alex");
    });
});
