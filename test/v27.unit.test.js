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
} from "../src/v27/index.js";

import extractFormValues from "../src/v27/listeners/v2/extractFormValues.js";
import resetForm from "../src/v27/listeners/v2/resetForm.js";

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
        this.options = [];
        this.selectedIndex = 0;

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
                const tag = child.tagName.toLowerCase();
                if (selector.startsWith(".") && child.classList.contains(selector.slice(1))) {
                    results.push(child);
                } else if (selector.includes("input") && (tag === "input" || tag === "select" || tag === "textarea")) {
                    results.push(child);
                } else if (selector.includes("button") && tag === "button") {
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

describe("json-to-dom v27 Versioned Listeners & Form Footer Actions", () => {
    test("1. Meta information", () => {
        assert.equal(meta.version, "v27.0");
        assert.equal(typeof meta.description, "string");
    });

    test("2. Listeners Module Exports & Version Folders", () => {
        assert.ok(listeners);
        // Version folders
        assert.ok(listeners.v1, "listeners.v1 exists");
        assert.ok(listeners.v2, "listeners.v2 exists");

        // v1 exports
        assert.equal(typeof listeners.v1.bindActions, "function");
        assert.equal(typeof listeners.v1.extractInputs, "function");
        assert.equal(typeof listeners.v1.applyHighlight, "function");

        // v2 exports
        assert.equal(typeof listeners.v2.bindActions, "function");
        assert.equal(typeof listeners.v2.extractFormValues, "function");
        assert.equal(typeof listeners.v2.resetForm, "function");
        assert.equal(typeof listeners.v2.applyHighlight, "function");

        // Default facade exports
        assert.equal(typeof listeners.bindActions, "function");
        assert.equal(typeof bindActions, "function");
        assert.equal(typeof bindActions.v1, "function");
        assert.equal(typeof bindActions.v2, "function");
    });

    test("3. listeners.v1 - Row-scoped Action Delegation", () => {
        const container = new MockElement("div");
        const row = new MockElement("div");
        row.classList.add("ksrow");

        const input = new MockElement("input");
        input.name = "voucherType";
        input.value = "Sales/CA";
        row.appendChild(input);

        const btn = new MockElement("button");
        btn.setAttribute("data-action", "saveRow");
        btn.dataset.closestTarget = "ksrow";
        row.appendChild(btn);

        container.appendChild(row);

        let rowSaved = false;
        let capturedValues = null;

        listeners.v1.bindActions({
            container,
            actions: {
                saveRow: ({ values }) => {
                    rowSaved = true;
                    capturedValues = values;
                }
            }
        });

        container.dispatchEvent({ type: "click", target: btn });

        assert.equal(rowSaved, true);
        assert.equal(capturedValues.voucherType, "Sales/CA");
    });

    test("4. listeners.v2.extractFormValues - Extracts multi-field form data across rows", () => {
        const form = new MockElement("form");

        // Row 1: Voucher Number & Date
        const row1 = new MockElement("div");
        const vchNum = new MockElement("input");
        vchNum.name = "voucherNumber";
        vchNum.value = "VCH-1001";
        const vchDate = new MockElement("input");
        vchDate.name = "voucherDate";
        vchDate.value = "2026-09-13";
        row1.appendChild(vchNum);
        row1.appendChild(vchDate);
        form.appendChild(row1);

        // Row 2: Select dropdown
        const row2 = new MockElement("div");
        const select = new MockElement("select");
        select.name = "voucherType";
        select.value = "Purchase";
        row2.appendChild(select);
        form.appendChild(row2);

        // Row 3: Amount & Checkbox
        const row3 = new MockElement("div");
        const amount = new MockElement("input");
        amount.name = "amount";
        amount.value = "12500";
        const active = new MockElement("input");
        active.name = "isApproved";
        active.type = "checkbox";
        active.checked = true;
        row3.appendChild(amount);
        row3.appendChild(active);
        form.appendChild(row3);

        const extracted = extractFormValues({ inElement: form });

        assert.equal(extracted.voucherNumber, "VCH-1001");
        assert.equal(extracted.voucherDate, "2026-09-13");
        assert.equal(extracted.voucherType, "Purchase");
        assert.equal(extracted.amount, "12500");
        assert.equal(extracted.isApproved, true);
    });

    test("5. listeners.v2.resetForm - Clears and restores form fields", () => {
        const form = new MockElement("div");

        const input1 = new MockElement("input");
        input1.name = "vchNum";
        input1.value = "VCH-999";
        form.appendChild(input1);

        const checkbox = new MockElement("input");
        checkbox.name = "active";
        checkbox.type = "checkbox";
        checkbox.checked = true;
        form.appendChild(checkbox);

        resetForm({ inElement: form });

        assert.equal(input1.value, "");
        assert.equal(checkbox.checked, false);
    });

    test("6. listeners.v2.bindActions - Form Footer Actions: Save and Cancel", () => {
        const form = new MockElement("div");
        form.classList.add("ksform");

        // Row 1: Form field (NO button in row)
        const row1 = new MockElement("div");
        row1.classList.add("form-row");
        const nameInput = new MockElement("input");
        nameInput.name = "partyName";
        nameInput.value = "Acme Supplies";
        row1.appendChild(nameInput);
        form.appendChild(row1);

        // Row 2: Form field (NO button in row)
        const row2 = new MockElement("div");
        row2.classList.add("form-row");
        const amountInput = new MockElement("input");
        amountInput.name = "totalAmount";
        amountInput.value = "50000";
        row2.appendChild(amountInput);
        form.appendChild(row2);

        // Form Footer: Save and Cancel buttons
        const footer = new MockElement("div");
        footer.classList.add("form-footer");

        const saveBtn = new MockElement("button");
        saveBtn.setAttribute("data-action", "save");
        saveBtn.textContent = "Save";

        const cancelBtn = new MockElement("button");
        cancelBtn.setAttribute("data-action", "cancel");
        cancelBtn.textContent = "Cancel";

        footer.appendChild(saveBtn);
        footer.appendChild(cancelBtn);
        form.appendChild(footer);

        let savedData = null;
        let cancelFired = false;

        listeners.v2.bindActions({
            container: form,
            actions: {
                save: ({ values, form: targetForm }) => {
                    savedData = values;
                    assert.equal(targetForm, form);
                },
                cancel: ({ reset }) => {
                    cancelFired = true;
                    reset();
                }
            }
        });

        // 1. Click Save in Footer
        form.dispatchEvent({ type: "click", target: saveBtn });
        assert.ok(savedData, "Save action was triggered");
        assert.equal(savedData.partyName, "Acme Supplies");
        assert.equal(savedData.totalAmount, "50000");

        // 2. Click Cancel in Footer
        form.dispatchEvent({ type: "click", target: cancelBtn });
        assert.equal(cancelFired, true, "Cancel action was triggered");
        assert.equal(nameInput.value, "", "partyName was reset");
        assert.equal(amountInput.value, "", "totalAmount was reset");
    });

    test("7. Core DOM Builder & Dual Output remain intact in v27", () => {
        const uninstall = installMockDocument();
        try {
            const spec = {
                tagName: "form",
                children: [
                    {
                        tagName: "input",
                        attributes: { name: "testField", value: "hello" }
                    },
                    {
                        tagName: "button",
                        attributes: { "data-action": "save", type: "button" },
                        textContent: "Save Form"
                    }
                ]
            };

            const html = specToHtml({ spec });
            assert.ok(html.includes('data-action="save"'));
            assert.ok(html.includes('name="testField"'));

            const dom = specToDom({ spec, domIdToPushTo: "target-container" });
            assert.equal(dom.tagName, "FORM");
            assert.equal(dom.children.length, 2);
        } finally {
            uninstall();
        }
    });
});
