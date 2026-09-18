import { describe, test } from "node:test";
import assert from "node:assert/strict";

import buildSpecElement, {
    jsonToDom,
    specToDom,
    specToHtml,
    validate,
    data,
    meta,
    tree
} from "../src/v25/index.js";

class MockNode {}

class MockElement extends MockNode {
    constructor(tagName) {
        super();
        this.tagName = tagName.toUpperCase();
        this._className = "";
        this.classList = {
            classes: [],
            add: (...classNames) => {
                this.classList.classes.push(...classNames);
            }
        };
        this.attributes = {};
        this.children = [];
        this.textContent = "";
    }

    get className() {
        return this.classList.classes.length > 0 ? this.classList.classes.join(" ") : this._className;
    }

    set className(val) {
        this._className = val;
        this.classList.classes = val ? val.split(/\s+/).filter(Boolean) : [];
    }

    setAttribute(key, value) {
        this.attributes[key] = value;
    }

    removeAttribute(key) {
        delete this.attributes[key];
    }

    appendChild(child) {
        this.children.push(child);
    }

    append(...children) {
        this.children.push(...children);
    }

    get outerHTML() {
        const tag = this.tagName.toLowerCase();
        const attrs = Object.entries(this.attributes)
            .map(([k, v]) => v === "" ? ` ${k}` : ` ${k}="${v}"`)
            .join("");
        const classAttr = this.className ? ` class="${this.className}"` : "";
        const inner = this.children.length > 0
            ? this.children.map(c => c.outerHTML || c.textContent || "").join("")
            : (this.textContent || "");
        return `<${tag}${classAttr}${attrs}>${inner}</${tag}>`;
    }
}

class MockTextNode extends MockNode {
    constructor(textContent) {
        super();
        this.nodeType = 3;
        this.textContent = textContent;
    }
}

const installMockDocument = () => {
    const originalNode = globalThis.Node;
    const originalDocument = globalThis.document;

    globalThis.Node = MockNode;
    const containers = {};

    globalThis.document = {
        createElement: (tagName) => new MockElement(tagName),
        createTextNode: (text) => new MockTextNode(text),
        getElementById: (id) => containers[id] || (containers[id] = new MockElement("div"))
    };

    return () => {
        globalThis.Node = originalNode;
        globalThis.document = originalDocument;
    };
};

describe("json-to-dom v25 Internal Versioned Validation Ecosystem", () => {
    test("1. Meta information", () => {
        assert.equal(meta.version, "v25.0");
        assert.equal(typeof meta.description, "string");
    });

    test("2. Versioned Validation Structure: validate.v1 and validate.v2 exposed", () => {
        assert.equal(typeof validate, "function");
        assert.equal(typeof validate.v1, "function");
        assert.equal(typeof validate.v2, "function");
    });

    test("3. validate.v1 Baseline Tag & Attribute Validation", () => {
        // Valid spec passes v1
        const validRes = validate.v1({
            spec: {
                tagName: "button",
                textContent: "Save",
                attributes: { type: "button" }
            }
        });
        assert.equal(validRes.isValid, true);

        // Invalid attribute fails v1
        const badAttrRes = validate.v1({
            spec: {
                tagName: "button",
                attributes: { href: "https://bad.url" }
            }
        });
        assert.equal(badAttrRes.isValid, false);
        assert.ok(badAttrRes.errors[0].includes('Attribute "href" is not allowed'));
    });

    test("4. validate.v2 Advanced Multi-Layer Validation: Void Tag Enforcement", () => {
        // Void element <input> with children should fail v2
        const badVoidRes = validate.v2({
            spec: {
                tagName: "input",
                attributes: { type: "text" },
                children: [
                    { tagName: "span", textContent: "Child inside void input" }
                ]
            }
        });
        assert.equal(badVoidRes.isValid, false);
        assert.ok(badVoidRes.errors.some(e => e.includes("Void Element Violation")));
    });

    test("5. validate.v2 Advanced Multi-Layer Validation: Tree Hierarchy Rules", () => {
        // <tr> placed directly under <div> violates HTML hierarchy (must be in table/thead/tbody/tfoot)
        const badTrTree = {
            tagName: "div",
            children: [
                { tagName: "tr", textContent: "Misplaced table row" }
            ]
        };

        const hierarchyRes = validate.v2({ spec: badTrTree });
        assert.equal(hierarchyRes.isValid, false);
        assert.ok(hierarchyRes.hierarchyViolations.length > 0);
        assert.ok(hierarchyRes.hierarchyViolations[0].includes("<tr> cannot be placed inside <div>"));

        // Valid <table> containing <tr> passes
        const goodTableTree = {
            tagName: "table",
            children: [
                { tagName: "tr", textContent: "Valid row" }
            ]
        };
        const goodRes = validate.v2({ spec: goodTableTree });
        assert.equal(goodRes.isValid, true);
        assert.equal(goodRes.hierarchyViolations.length, 0);
    });

    test("6. validate.v2 Interactive Nesting Violations", () => {
        // <button> inside <button>
        const badInteractiveTree = {
            tagName: "button",
            children: [
                { tagName: "button", textContent: "Nested button" }
            ]
        };

        const interactiveRes = validate.v2({ spec: badInteractiveTree });
        assert.equal(interactiveRes.isValid, false);
        assert.ok(interactiveRes.hierarchyViolations.some(e => e.includes("Interactive element <button> cannot be nested inside <button>")));
    });

    test("7. Core DOM Builder & Dual Output with Clean API", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "div",
                attributes: { id: "banner" },
                textContent: "Banner Content"
            };

            // specToHtml
            const html = specToHtml({ spec });
            assert.equal(html, '<div id="banner">Banner Content</div>');

            // specToDom
            const dom = specToDom({ spec, domIdToPushTo: "target-container" });
            assert.equal(dom.tagName, "DIV");
            assert.equal(dom.textContent, "Banner Content");

            const container = document.getElementById("target-container");
            assert.equal(container.children.length, 1);
            assert.equal(container.children[0], dom);
        } finally {
            uninstall();
        }
    });
});
