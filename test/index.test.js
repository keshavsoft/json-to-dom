import { describe, test } from "node:test";
import assert from "node:assert/strict";

import buildSpecElement, {
    specToDom,
    meta
} from "../index.js";

class MockNode {}

class MockElement extends MockNode {
    constructor(tagName) {
        super();
        this.tagName = tagName.toUpperCase();
        this._className = "";
        this.dataset = {};
        this.attributes = {};
        this.children = [];
        this.textContent = "";

        this.classList = {
            classes: [],
            add: (...classNames) => {
                this.classList.classes.push(...classNames);
            },
            remove: (...classNames) => {
                this.classList.classes = this.classList.classes.filter(c => !classNames.includes(c));
            },
            contains: (className) => this.classList.classes.includes(className)
        };
    }

    setAttribute(key, value) {
        this.attributes[key] = value;
    }

    appendChild(child) {
        this.children.push(child);
        child.parentElement = this;
    }

    append(...children) {
        children.forEach(c => this.appendChild(c));
    }
}

const installMockDocument = () => {
    const originalNode = globalThis.Node;
    const originalDocument = globalThis.document;

    globalThis.Node = MockNode;

    globalThis.document = {
        createElement: (tagName) => new MockElement(tagName),
        createTextNode: (text) => ({ nodeType: 3, textContent: text }),
        getElementById: () => new MockElement("div")
    };

    return () => {
        globalThis.Node = originalNode;
        globalThis.document = originalDocument;
    };
};

describe("json-to-dom root index.js package entry", () => {
    test("Root exports correspond to v39", () => {
        assert.equal(typeof buildSpecElement, "function");
        assert.equal(typeof specToDom, "function");
        assert.ok(meta, "meta is exported");
        assert.equal(meta.version, "v39.0");
    });

    test("Builds element through root export", () => {
        const uninstall = installMockDocument();
        try {
            const el = buildSpecElement({
                spec: {
                    tagName: "div",
                    textContent: "Package root works!"
                }
            });

            assert.equal(el.tagName, "DIV");
            assert.equal(el.textContent, "Package root works!");
        } finally {
            uninstall();
        }
    });
});
