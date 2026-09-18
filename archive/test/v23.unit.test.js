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
} from "../src/v23/index.js";

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

describe("json-to-dom v23 Architecture & Validation Decoupling", () => {
    test("1. Meta information", () => {
        assert.equal(meta.version, "v23.0");
        assert.equal(typeof meta.description, "string");
    });

    test("2. Standalone Validate Suite (Callable Function & Sub-utilities)", () => {
        assert.equal(typeof validate, "function");
        assert.equal(typeof validate.validateSpec, "function");
        assert.equal(typeof validate.validateTag, "function");
        assert.equal(typeof validate.isAttributeAllowed, "function");
        assert.equal(typeof validate.isTagValid, "function");
        assert.equal(typeof validate.getTagDefinition, "function");

        // Direct function call with clean param: validate({ spec })
        const validResult = validate({
            spec: {
                tagName: "button",
                textContent: "Click Me",
                attributes: { type: "button", disabled: true }
            }
        });
        assert.equal(validResult.isValid, true);
        assert.equal(validResult.errors.length, 0);

        // Direct function call detecting invalid tag
        const invalidTagResult = validate({
            spec: {
                tagName: "nonexistenttag123"
            }
        });
        assert.equal(invalidTagResult.isValid, false);
        assert.ok(invalidTagResult.errors[0].includes("Unknown or unsupported"));

        // Direct function call detecting invalid attribute for element
        const invalidAttrResult = validate({
            spec: {
                tagName: "button",
                attributes: { href: "https://example.com" } // button doesn't have href
            }
        });
        assert.equal(invalidAttrResult.isValid, false);
        assert.ok(invalidAttrResult.errors[0].includes('Attribute "href" is not allowed'));
    });

    test("3. Data layer access", () => {
        assert.ok(data.tags);
        assert.ok(data.tags.table);
        assert.ok(data.tags.button);
        assert.ok(data.globalAllowedAttributes);
    });

    test("4. Core DOM Builder with Clean Outside API (no 'in' prefix)", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "div",
                classList: "container flex",
                attributes: { "data-role": "wrapper" },
                children: [
                    {
                        tagName: "button",
                        textContent: "Save",
                        attributes: { type: "submit" }
                    }
                ]
            };

            // Calling buildSpecElement with { spec }
            const el = buildSpecElement({ spec });
            assert.equal(el.tagName, "DIV");
            assert.equal(el.className, "container flex");
            assert.equal(el.attributes["data-role"], "wrapper");
            assert.equal(el.children.length, 1);
            assert.equal(el.children[0].tagName, "BUTTON");
            assert.equal(el.children[0].textContent, "Save");
        } finally {
            uninstall();
        }
    });

    test("5. Dual Output: specToHtml and specToDom with Clean API", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "span",
                textContent: "Badge",
                attributes: { id: "badge-1" }
            };

            // specToHtml
            const html = specToHtml({ spec });
            assert.equal(html, '<span id="badge-1">Badge</span>');

            // specToDom
            const dom = specToDom({ spec, domIdToPushTo: "target-container" });
            assert.equal(dom.tagName, "SPAN");
            assert.equal(dom.textContent, "Badge");

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
                // Should render fine even if spec has invalid attribute, but logs warning
                const specWithBadAttr = {
                    tagName: "span",
                    attributes: { href: "https://bad.link" },
                    textContent: "Link Span"
                };

                const el = buildSpecElement({ spec: specWithBadAttr, validate: true });
                assert.equal(el.tagName, "SPAN");
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
