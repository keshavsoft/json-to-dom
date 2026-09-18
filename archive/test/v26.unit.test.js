import { describe, test } from "node:test";
import assert from "node:assert/strict";

import buildSpecElement, {
    jsonToDom,
    specToDom,
    specToHtml,
    validate,
    listeners,
    bindActions,
    data,
    meta,
    tree
} from "../src/v26/index.js";

import extractInputs from "../src/v26/listeners/extractInputs.js";
import applyHighlight from "../src/v26/listeners/applyHighlight.js";

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
        this.listeners = {};
        this.value = "";
        this.name = "";
        this.id = "";
        this.type = "text";
        this.checked = false;

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

    addEventListener(event, handler) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(handler);
    }

    removeEventListener(event, handler) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }

    dispatchEvent(event) {
        let current = event.target || this;
        while (current) {
            if (current.listeners[event.type]) {
                current.listeners[event.type].forEach(h => h(event));
            }
            current = current.parentElement;
        }
    }

    closest(selector) {
        let current = this;
        while (current) {
            if (selector.startsWith(".") && current.classList.contains(selector.slice(1))) {
                return current;
            }
            if (selector.startsWith("[") && selector.endsWith("]")) {
                const attrName = selector.slice(1, -1);
                if (current.attributes && attrName in current.attributes) {
                    return current;
                }
            }
            if (current.tagName.toLowerCase() === selector.toLowerCase()) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    querySelectorAll(selector) {
        const results = [];
        const traverse = (node) => {
            node.children.forEach(child => {
                if (selector.startsWith(".") && child.classList.contains(selector.slice(1))) {
                    results.push(child);
                } else if (selector.includes("input") && child.tagName === "INPUT") {
                    results.push(child);
                }
                traverse(child);
            });
        };
        traverse(this);
        return results;
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

describe("json-to-dom v26 Dedicated Event Listener Engine", () => {
    test("1. Meta information", () => {
        assert.equal(meta.version, "v26.0");
        assert.equal(typeof meta.description, "string");
    });

    test("2. Listeners Module Exports", () => {
        assert.ok(listeners);
        assert.equal(typeof listeners.bindActions, "function");
        assert.equal(typeof listeners.extractInputs, "function");
        assert.equal(typeof listeners.applyHighlight, "function");
        assert.equal(typeof bindActions, "function");
    });

    test("3. extractInputs - Extracts input values from container", () => {
        const row = new MockElement("div");
        const input1 = new MockElement("input");
        input1.name = "voucherType";
        input1.value = "Sales/CA";
        row.appendChild(input1);

        const input2 = new MockElement("input");
        input2.name = "active";
        input2.type = "checkbox";
        input2.checked = true;
        row.appendChild(input2);

        const extracted = extractInputs({ inElement: row });
        assert.equal(extracted.voucherType, "Sales/CA");
        assert.equal(extracted.active, true);
    });

    test("4. applyHighlight - Radio highlight behavior across siblings", () => {
        const container = new MockElement("div");

        const row1 = new MockElement("div");
        row1.classList.add("ksrow", "highlight-active");
        container.appendChild(row1);

        const row2 = new MockElement("div");
        row2.classList.add("ksrow");
        const btn2 = new MockElement("button");
        btn2.dataset.highlight = "true";
        btn2.dataset.highlightClass = "highlight-active";
        btn2.dataset.closestTarget = "ksrow";
        row2.appendChild(btn2);
        container.appendChild(row2);

        applyHighlight({
            inTargetElement: btn2,
            inClosestElement: row2,
            inContainerElement: container
        });

        assert.equal(row1.classList.contains("highlight-active"), false, "Row 1 highlight removed");
        assert.equal(row2.classList.contains("highlight-active"), true, "Row 2 highlight applied");
    });

    test("5. bindActions - Dispatches action callback on button click", () => {
        const container = new MockElement("div");

        const row = new MockElement("div");
        row.classList.add("ksrow");

        const input = new MockElement("input");
        input.name = "voucher1";
        input.value = "Sales/CA";
        row.appendChild(input);

        const btn = new MockElement("button");
        btn.setAttribute("data-action", "saveVoucher");
        btn.dataset.closestTarget = "ksrow";
        btn.textContent = "Save";
        row.appendChild(btn);

        container.appendChild(row);

        let actionFired = false;
        let receivedData = null;

        const { remove } = bindActions({
            container,
            actions: {
                saveVoucher: ({ target, values }) => {
                    actionFired = true;
                    receivedData = values;
                    assert.equal(target, btn);
                }
            }
        });

        // Simulate click
        container.dispatchEvent({
            type: "click",
            target: btn
        });

        assert.equal(actionFired, true, "saveVoucher action handler executed");
        assert.equal(receivedData.voucher1, "Sales/CA", "Row input values correctly extracted");

        // Clean teardown test
        remove();
    });

    test("6. Core DOM Builder & Dual Output intact in v26", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "button",
                attributes: { "data-action": "save", type: "button" },
                textContent: "Save"
            };

            const html = specToHtml({ spec });
            assert.ok(html.includes('data-action="save"'));

            const dom = specToDom({ spec, domIdToPushTo: "target-container" });
            assert.equal(dom.tagName, "BUTTON");
            assert.equal(dom.attributes["data-action"], "save");
        } finally {
            uninstall();
        }
    });
});
