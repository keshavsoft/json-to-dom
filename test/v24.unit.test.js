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
} from "../src/v24/index.js";

import dispatchSpec, {
    buildSingleElement,
    buildSpecArray
} from "../src/v24/jsonToDom/buildSpec/index.js";

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

describe("json-to-dom v24 Unidirectional Architecture & Self-Contained buildSpec", () => {
    test("1. Meta information", () => {
        assert.equal(meta.version, "v24.0");
        assert.equal(typeof meta.description, "string");
    });

    test("2. Self-Contained buildSpec Module (Direct Call & Internal Recursion)", () => {
        const uninstall = installMockDocument();
        try {
            assert.equal(typeof dispatchSpec, "function");
            assert.equal(typeof buildSingleElement, "function");
            assert.equal(typeof buildSpecArray, "function");

            // Verify buildSpec works standalone with nested children (recursion inside buildSpec)
            const specWithNestedChildren = {
                tagName: "ul",
                classList: "list-group",
                children: [
                    { tagName: "li", textContent: "Item 1" },
                    { tagName: "li", textContent: "Item 2" },
                    "Text node direct"
                ]
            };

            const dom = dispatchSpec({ inSpec: specWithNestedChildren });
            assert.equal(dom.tagName, "UL");
            assert.equal(dom.children.length, 3);
            assert.equal(dom.children[0].tagName, "LI");
            assert.equal(dom.children[0].textContent, "Item 1");
            assert.equal(dom.children[1].tagName, "LI");
            assert.equal(dom.children[1].textContent, "Item 2");
            assert.equal(dom.children[2].nodeType, 3);
            assert.equal(dom.children[2].textContent, "Text node direct");
        } finally {
            uninstall();
        }
    });

    test("3. Standalone Validate Suite (Callable Function & Sub-utilities)", () => {
        assert.equal(typeof validate, "function");
        assert.equal(typeof validate.validateSpec, "function");
        assert.equal(typeof validate.validateTag, "function");
        assert.equal(typeof validate.isAttributeAllowed, "function");
        assert.equal(typeof validate.isTagValid, "function");
        assert.equal(typeof validate.getTagDefinition, "function");

        // Clean parameter call: validate({ spec })
        const validResult = validate({
            spec: {
                tagName: "button",
                textContent: "Save",
                attributes: { type: "button", disabled: true }
            }
        });
        assert.equal(validResult.isValid, true);
        assert.equal(validResult.errors.length, 0);

        // Invalid attribute detection
        const invalidAttrResult = validate({
            spec: {
                tagName: "button",
                attributes: { href: "https://example.com" }
            }
        });
        assert.equal(invalidAttrResult.isValid, false);
        assert.ok(invalidAttrResult.errors[0].includes('Attribute "href" is not allowed'));
    });

    test("4. Core DOM Builder with Clean Outside API (no 'in' prefix)", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "div",
                classList: "row-wrapper",
                attributes: { "data-role": "card" },
                children: [
                    {
                        tagName: "button",
                        textContent: "Submit",
                        attributes: { type: "submit" }
                    }
                ]
            };

            const el = buildSpecElement({ spec });
            assert.equal(el.tagName, "DIV");
            assert.equal(el.className, "row-wrapper");
            assert.equal(el.attributes["data-role"], "card");
            assert.equal(el.children.length, 1);
            assert.equal(el.children[0].tagName, "BUTTON");
            assert.equal(el.children[0].textContent, "Submit");
        } finally {
            uninstall();
        }
    });

    test("5. Dual Output: specToHtml and specToDom with Clean API", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "div",
                attributes: { id: "alert-box" },
                textContent: "Alert Message"
            };

            // specToHtml
            const html = specToHtml({ spec });
            assert.equal(html, '<div id="alert-box">Alert Message</div>');

            // specToDom
            const dom = specToDom({ spec, domIdToPushTo: "target-container" });
            assert.equal(dom.tagName, "DIV");
            assert.equal(dom.textContent, "Alert Message");

            const container = document.getElementById("target-container");
            assert.equal(container.children.length, 1);
            assert.equal(container.children[0], dom);
        } finally {
            uninstall();
        }
    });

    test("6. Opt-in Validation Flag (validate: true)", () => {
        const uninstall = installMockDocument();
        try {
            const warnedMessages = [];
            const originalWarn = console.warn;
            console.warn = (...args) => {
                warnedMessages.push(args);
            };

            try {
                const specWithBadAttr = {
                    tagName: "button",
                    attributes: { href: "https://bad.link" },
                    textContent: "Bad Button"
                };

                const el = buildSpecElement({ spec: specWithBadAttr, validate: true });
                assert.equal(el.tagName, "BUTTON");
                assert.ok(warnedMessages.length > 0, "Validation warning should have fired");
                assert.ok(
                    JSON.stringify(warnedMessages).includes("validation error"),
                    "Should mention validation error in console"
                );
            } finally {
                console.warn = originalWarn;
            }
        } finally {
            uninstall();
        }
    });
});
