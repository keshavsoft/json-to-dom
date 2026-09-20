import { describe, test } from "node:test";
import assert from "node:assert/strict";

import buildSpecElement, {
    specToDom,
    meta,
    buildSpec
} from "../src/v40/index.js";

class MockNode {}

class MockElement extends MockNode {
    constructor(tagName) {
        super();
        this.tagName = tagName.toUpperCase();
        this._className = "";
        this.dataset = {};
        this.attributes = {};
        this.children = [];
        this.parentElement = null;
        this.value = "";
        this.name = "";
        this.id = "";
        this.type = "text";
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

    get className() {
        return this.classList.classes.length > 0 ? this.classList.classes.join(" ") : this._className;
    }

    set className(val) {
        this._className = val;
        this.classList.classes = val ? val.split(/\s+/).filter(Boolean) : [];
    }

    setAttribute(key, value) {
        this.attributes[key] = value;
        if (key.startsWith("data-")) {
            const camelKey = key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            this.dataset[camelKey] = value;
        }
        if (key === "name") this.name = value;
        if (key === "id") this.id = value;
        if (key === "value") this.value = value;
        if (key === "type") this.type = value;
    }

    removeAttribute(key) {
        delete this.attributes[key];
    }

    appendChild(child) {
        this.children.push(child);
        child.parentElement = this;
    }

    append(...children) {
        children.forEach(c => this.appendChild(c));
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

describe("json-to-dom v40 Engine", () => {
    test("1. Meta information", () => {
        assert.equal(meta.version, "v40.0");
        assert.equal(typeof meta.description, "string");
        assert.equal(meta.description, "Pure DOM engine only from json with activation");
    });

    test("2. Build single element with attributes, classList, and textContent", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "button",
                textContent: "Click Me",
                classList: "btn btn-primary",
                attributes: {
                    type: "button",
                    "data-action": "submit"
                }
            };

            const element = buildSpecElement({ spec });
            assert.equal(element.tagName, "BUTTON");
            assert.equal(element.textContent, "Click Me");
            assert.ok(element.classList.contains("btn"));
            assert.ok(element.classList.contains("btn-primary"));
            assert.equal(element.attributes["data-action"], "submit");
            assert.equal(element.dataset.action, "submit");
        } finally {
            uninstall();
        }
    });

    test("3. Build nested element tree with children", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "div",
                classList: "card",
                children: [
                    {
                        tagName: "h3",
                        textContent: "Card Title"
                    },
                    {
                        tagName: "p",
                        textContent: "Card content description"
                    },
                    {
                        tagName: "input",
                        attributes: {
                            type: "text",
                            name: "username",
                            value: "admin"
                        }
                    }
                ]
            };

            const element = buildSpecElement({ spec });
            assert.equal(element.tagName, "DIV");
            assert.equal(element.children.length, 3);
            assert.equal(element.children[0].tagName, "H3");
            assert.equal(element.children[0].textContent, "Card Title");
            assert.equal(element.children[1].tagName, "P");
            assert.equal(element.children[2].tagName, "INPUT");
            assert.equal(element.children[2].value, "admin");
        } finally {
            uninstall();
        }
    });

    test("4. Build spec array (e.g. list items)", () => {
        const uninstall = installMockDocument();
        try {
            const specArray = [
                { tagName: "li", textContent: "Item 1" },
                { tagName: "li", textContent: "Item 2" },
                { tagName: "li", textContent: "Item 3" }
            ];

            const elements = buildSpecElement({ spec: specArray });
            assert.ok(Array.isArray(elements), "Returns array of elements");
            assert.equal(elements.length, 3);
            assert.equal(elements[0].tagName, "LI");
            assert.equal(elements[0].textContent, "Item 1");
            assert.equal(elements[1].textContent, "Item 2");
            assert.equal(elements[2].textContent, "Item 3");
        } finally {
            uninstall();
        }
    });

    test("5. Mount element to container with targetHtmlId / domIdToPushTo", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "span",
                textContent: "Mounted Content"
            };

            const mounted = specToDom({ spec, domIdToPushTo: "test-container" });
            const container = document.getElementById("test-container");

            assert.equal(mounted.tagName, "SPAN");
            assert.equal(container.children.length, 1);
            assert.equal(container.children[0].tagName, "SPAN");
            assert.equal(container.children[0].textContent, "Mounted Content");
        } finally {
            uninstall();
        }
    });

    test("6. Supports parameter naming convention (inSpec, inDomIdToPushTo, inTargetHtmlId)", () => {
        const uninstall = installMockDocument();
        try {
            const inSpec = {
                tagName: "div",
                textContent: "Convention check"
            };

            const element = buildSpecElement({ inSpec, inTargetHtmlId: "convention-container" });
            const container = document.getElementById("convention-container");

            assert.equal(element.tagName, "DIV");
            assert.equal(element.textContent, "Convention check");
            assert.equal(container.children.length, 1);
            assert.equal(container.children[0].textContent, "Convention check");
        } finally {
            uninstall();
        }
    });

    test("7. Global registration on globalThis.ks", () => {
        assert.ok(globalThis.ks);
        assert.ok(globalThis.ks["json-to-dom"]);
        assert.equal(globalThis.ks["json-to-dom"].meta.version, "v40.0");
        assert.equal(typeof globalThis.ks["json-to-dom"].buildSpecElement, "function");
    });
});
