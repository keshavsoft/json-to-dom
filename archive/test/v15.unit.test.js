import { describe, test } from "node:test";
import assert from "node:assert/strict";

import buildSpecElement, {
    jsonToDom,
    buildSpecElementWithEvents,
    specToDom,
    validate,
    data,
    meta,
    tree
} from "../src/v15/index.js";

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

describe("v15 Pure jsonToDom Engine Suite", () => {
    test("1. Version & Clean Identity", () => {
        assert.equal(meta.version, "v15.0");
        assert.ok(jsonToDom.core.buildSpecElement);
        // Verify Reverse is NOT present in v15
        assert.equal(tree.reverse, undefined);
        assert.equal(jsonToDom.blues, undefined);
    });

    test("2. buildSpecElement creates valid elements", () => {
        const cleanup = installMockDocument();
        try {
            const el = buildSpecElement({
                inSpec: {
                    tagName: "div",
                    attributes: {
                        class: "container mt-3"
                    },
                    children: [
                        {
                            tagName: "label",
                            textContent: "User Name"
                        },
                        {
                            tagName: "input",
                            attributes: {
                                type: "text",
                                name: "username"
                            }
                        }
                    ]
                }
            });

            assert.ok(el);
            assert.equal(el.tagName, "DIV");
            assert.equal(el.className, "container mt-3");
            assert.equal(el.children.length, 2);
            assert.equal(el.children[0].tagName, "LABEL");
            assert.equal(el.children[0].textContent, "User Name");
            assert.equal(el.children[1].tagName, "INPUT");
            assert.equal(el.children[1].attributes.type, "text");
            assert.equal(el.children[1].attributes.name, "username");
        } finally {
            cleanup();
        }
    });

    test("3. Discard invalid tags gracefully", () => {
        const cleanup = installMockDocument();
        try {
            const el = buildSpecElement({
                inSpec: {
                    tagName: "invalidCustomElement",
                    textContent: "Should fail"
                }
            });
            assert.equal(el, null);
        } finally {
            cleanup();
        }
    });

    test("4. Handle array of specs", () => {
        const cleanup = installMockDocument();
        try {
            const result = buildSpecElement({
                inSpec: [
                    { tagName: "h1", textContent: "Heading" },
                    { tagName: "p", textContent: "Paragraph" }
                ]
            });
            assert.ok(Array.isArray(result));
            assert.equal(result.length, 2);
            assert.equal(result[0].tagName, "H1");
            assert.equal(result[1].tagName, "P");
        } finally {
            cleanup();
        }
    });
});
