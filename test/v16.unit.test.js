import { describe, test } from "node:test";
import assert from "node:assert/strict";

import buildSpecElement, {
    jsonToDom,
    validate,
    data,
    meta,
    tree
} from "../src/v16/index.js";

class MockNode {}

class MockElement extends MockNode {
    constructor(tagName) {
        super();
        this.tagName = tagName.toUpperCase();
        this.className = "";
        this.classList = {
            classes: [],
            add: (...classNames) => {
                this.classList.classes.push(...classNames);
            }
        };
        this.attributes = {};
        this.children = [];
        this.textContent = "";
        this.__events = {};
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

    addEventListener(event, handler) {
        this.__events[event] = handler;
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
    globalThis.document = {
        createElement: (tagName) => new MockElement(tagName),
        createTextNode: (textContent) => new MockTextNode(textContent),
        getElementById: () => new MockElement("div")
    };

    return () => {
        if (originalNode === undefined) {
            delete globalThis.Node;
        } else {
            globalThis.Node = originalNode;
        }

        if (originalDocument === undefined) {
            delete globalThis.document;
        } else {
            globalThis.document = originalDocument;
        }
    };
};

describe("v16 Hybrid Core & Basic Row Suite", () => {
    test("1. Version & Hybrid Data Available", () => {
        assert.equal(meta.version, "v16.0");
        assert.ok(data.hybrid, "hybrid dataset should be present in data");
        assert.ok(data.hybrid.inlineInputRow, "inlineInputRow should be present in data.hybrid");
    });

    test("2. buildSpecElement renders data.hybrid.inlineInputRow", () => {
        const cleanup = installMockDocument();
        try {
            const spec = data.hybrid.inlineInputRow;
            const el = buildSpecElement({ inSpec: spec });

            assert.ok(el, "Should build DOM element");
            assert.equal(el.tagName, "DIV");
            assert.equal(el.className, "d-flex align-items-center gap-2 mb-3");
            assert.equal(el.children.length, 2);

            // Child 0: label
            assert.equal(el.children[0].tagName, "LABEL");
            assert.equal(el.children[0].textContent, "User Name");
            assert.equal(el.children[0].className, "form-label mb-0 fw-semibold text-secondary");

            // Child 1: input
            assert.equal(el.children[1].tagName, "INPUT");
            assert.equal(el.children[1].attributes.type, "text");
            assert.equal(el.children[1].attributes.name, "userName");
            assert.equal(el.children[1].className, "form-control");
        } finally {
            cleanup();
        }
    });
});
