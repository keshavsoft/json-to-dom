import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Initialize mock DOM environment for Node.js test runner
globalThis.Node ??= class Node {};
globalThis.document ??= {
    createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        className: "",
        classList: {
            classes: [],
            add(...cls) { this.classes.push(...cls); }
        },
        attributes: {},
        setAttribute(k, v) { this.attributes[k] = v; },
        removeAttribute(k) { delete this.attributes[k]; },
        children: [],
        appendChild(child) { this.children.push(child); },
        listeners: {},
        addEventListener(ev, fn) {
            this.listeners[ev] = this.listeners[ev] || [];
            this.listeners[ev].push(fn);
        }
    }),
    createDocumentFragment: () => ({
        nodeType: 11,
        children: [],
        appendChild(child) { this.children.push(child); }
    }),
    createTextNode: (text) => ({ nodeType: 3, textContent: text })
};

import {
    version,
    buildSpecElement,
    buildSpecElementWithEvents,
    applyEvents,
    getHookedEvents,
    isEventAllowed,
    validateSpec
} from "../src/v11/index.js";

import { normalizeInput } from "../src/v11/orchestration/1.normalizeInput.js";
import { dispatchSpec } from "../src/v11/orchestration/2.dispatchSpec.js";
import { registerGlobal } from "../src/v11/orchestration/3.registerGlobal.js";
import rootBuildSpecElement, { version as rootVersion } from "../index.js";

describe("v11 Sleek Orchestration Engine Suite", () => {

    describe("1. Engine Version & Global Registration", () => {
        test("exports version v11.0", () => {
            assert.equal(version, "v11.0");
        });

        test("root index.js re-exports v11.0", () => {
            assert.equal(rootVersion, "v11.0");
            assert.equal(typeof rootBuildSpecElement, "function");
        });

        test("registers json-to-dom on globalThis.ks['json-to-dom']", () => {
            assert.ok(globalThis.ks);
            assert.ok(globalThis.ks["json-to-dom"]);
            assert.equal(globalThis.ks["json-to-dom"].version, "v11.0");
            assert.equal(typeof globalThis.ks["json-to-dom"].buildSpecElement, "function");
        });
    });

    describe("2. Orchestration Story Pipeline", () => {
        test("Step 1: normalizeInput normalizes raw spec and configuration object", () => {
            // Raw spec
            const raw = { tagName: "div" };
            const res1 = normalizeInput({ inArgs: raw });
            assert.equal(res1.spec, raw);
            assert.equal(res1.applyEvents, true);
            assert.equal(res1.showLog, false);

            // Wrapped spec with options
            const wrapped = {
                inSpec: { tagName: "span" },
                inApplyEvents: false,
                inShowLog: true
            };
            const res2 = normalizeInput({ inArgs: wrapped });
            assert.deepEqual(res2.spec, { tagName: "span" });
            assert.equal(res2.applyEvents, false);
            assert.equal(res2.showLog, true);
        });

        test("Step 2: dispatchSpec correctly routes different spec types", () => {
            // Null / Undefined
            assert.equal(dispatchSpec({ inSpec: null }), null);
            assert.equal(dispatchSpec({ inSpec: undefined }), null);

            // Existing DOM Node
            const mockNode = new globalThis.Node();
            assert.equal(dispatchSpec({ inSpec: mockNode }), mockNode);

            // Spec Array
            const arrSpec = [
                { tagName: "button", textContent: "Item 1" },
                { tagName: "button", textContent: "Item 2" }
            ];
            const elements = dispatchSpec({ inSpec: arrSpec });
            assert.ok(Array.isArray(elements));
            assert.equal(elements.length, 2);

            // Single Element
            const singleSpec = { tagName: "button", textContent: "Click Me" };
            const el = dispatchSpec({ inSpec: singleSpec });
            assert.ok(el);
            assert.equal(el.tagName, "BUTTON");
        });

        test("Step 3: registerGlobal attaches custom api without crashing", () => {
            const mockApi = { version: "v11.0-test" };
            registerGlobal({ inApi: mockApi });
            assert.equal(globalThis.ks["json-to-dom"].version, "v11.0-test");

            // Restore
            registerGlobal({ inApi: { version: "v11.0", buildSpecElement } });
        });
    });

    describe("3. buildSpecElement Orchestrator In Action", () => {
        test("builds pure DOM node without events when inApplyEvents is false", () => {
            let listenerCount = 0;
            const originalCreateElement = globalThis.document.createElement;

            globalThis.document.createElement = (tag) => {
                const el = originalCreateElement(tag);
                el.addEventListener = () => {
                    listenerCount++;
                };
                return el;
            };

            const spec = {
                tagName: "button",
                textContent: "Save",
                events: {
                    click: () => {}
                }
            };

            const element = buildSpecElement({ inSpec: spec, inApplyEvents: false });
            assert.ok(element);
            assert.equal(listenerCount, 0);

            globalThis.document.createElement = originalCreateElement;
        });

        test("builds DOM node with events attached by default", () => {
            let registeredEvents = [];
            const originalCreateElement = globalThis.document.createElement;

            globalThis.document.createElement = (tag) => {
                const el = originalCreateElement(tag);
                el.addEventListener = (ev) => {
                    registeredEvents.push(ev);
                };
                return el;
            };

            const spec = {
                tagName: "button",
                textContent: "Save",
                events: {
                    click: () => {}
                }
            };

            buildSpecElement({ inSpec: spec });
            assert.ok(registeredEvents.includes("click"));
            // 1 internal button click + 1 declared click
            assert.equal(registeredEvents.length, 2);

            globalThis.document.createElement = originalCreateElement;
        });

        test("buildSpecElementWithEvents binds events explicitly", () => {
            let registeredEvents = [];
            const originalCreateElement = globalThis.document.createElement;

            globalThis.document.createElement = (tag) => {
                const el = originalCreateElement(tag);
                el.addEventListener = (ev) => {
                    registeredEvents.push(ev);
                };
                return el;
            };

            const spec = {
                tagName: "input",
                attributes: { type: "text" },
                events: {
                    input: () => {}
                }
            };

            buildSpecElementWithEvents({ inSpec: spec });
            assert.ok(registeredEvents.includes("input"));

            globalThis.document.createElement = originalCreateElement;
        });
    });

    describe("4. End-to-End Validation & Event Stories in v11", () => {
        test("validates spec correctly with validateSpec", () => {
            const spec = {
                tagName: "input",
                attributes: { type: "text", class: "form-control" },
                events: { input: () => {} }
            };
            const result = validateSpec({ inSpec: spec });
            assert.equal(result.isValid, true);
        });

        test("standalone applyEvents story can be plugged into any element", () => {
            const registered = [];
            const mockElement = {
                addEventListener: (ev) => registered.push(ev)
            };

            applyEvents({
                inElement: mockElement,
                inEvents: { click: () => {} },
                inTagName: "button"
            });

            assert.equal(registered.length, 2);
            assert.ok(registered.includes("click"));
        });
    });

    describe("5. Granular Event Hooking & Inspection in v11", () => {
        test("stops internal button hook when inAttachInternal is false", () => {
            const spec = {
                tagName: "button",
                textContent: "Submit",
                events: { click: () => {} }
            };

            const element = buildSpecElement({ inSpec: spec, inAttachInternal: false });
            const hooked = getHookedEvents({ inElement: element });

            assert.deepEqual(hooked.internal, []);
            assert.deepEqual(hooked.declared, ["click"]);
        });

        test("stops internal button hook when inApplyEvents is { internal: false }", () => {
            const spec = {
                tagName: "button",
                textContent: "Submit",
                events: { click: () => {} }
            };

            const element = buildSpecElement({ inSpec: spec, inApplyEvents: { internal: false } });
            const hooked = getHookedEvents({ inElement: element });

            assert.deepEqual(hooked.internal, []);
            assert.deepEqual(hooked.declared, ["click"]);
        });

        test("stops declared events when inApplyEvents is { declared: false }", () => {
            const spec = {
                tagName: "button",
                textContent: "Submit",
                events: { click: () => {} }
            };

            const element = buildSpecElement({ inSpec: spec, inApplyEvents: { declared: false } });
            const hooked = getHookedEvents({ inElement: element });

            assert.deepEqual(hooked.internal, ["click"]);
            assert.deepEqual(hooked.declared, []);
        });

        test("stops internal hook when attachInternal is false in element spec", () => {
            const spec = {
                tagName: "button",
                textContent: "Submit",
                attachInternal: false,
                events: { click: () => {} }
            };

            const element = buildSpecElement({ inSpec: spec });
            const hooked = getHookedEvents({ inElement: element });

            assert.deepEqual(hooked.internal, []);
            assert.deepEqual(hooked.declared, ["click"]);
        });

        test("getHookedEvents and element.__ksEvents show exactly how events are hooked", () => {
            const spec = {
                tagName: "button",
                textContent: "Save",
                events: { click: () => {} }
            };

            const element = buildSpecElement({ inSpec: spec });

            assert.ok(element.__ksEvents);
            assert.deepEqual(element.__ksEvents.internal, ["click"]);
            assert.deepEqual(element.__ksEvents.declared, ["click"]);

            const hooked = getHookedEvents({ inElement: element });
            assert.deepEqual(hooked, element.__ksEvents);
        });
    });
});

