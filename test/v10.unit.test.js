import { test, describe, before } from "node:test";
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
    createTextNode: (text) => ({ nodeType: 3, textContent: text })
};

import {
    version,
    buildSpecElement,
    buildSpecElementWithEvents,
    applyEvents,
    isEventAllowed,
    validateSpec
} from "../src/v10/index.js";

import { handleButtonClick } from "../src/v10/events/2.internal/buttonClick/index.js";
import { getClosestTarget } from "../src/v10/events/2.internal/buttonClick/getClosestTarget.js";
import { applyHighlight } from "../src/v10/events/2.internal/buttonClick/applyHighlight.js";
import { extractOutput } from "../src/v10/events/2.internal/buttonClick/extractOutput.js";

describe("v10 Modular Engine & Event Story Suite", () => {

    describe("1. Engine Version & Basics", () => {
        test("exports version v10.0", () => {
            assert.equal(version, "v10.0");
        });

        test("builds pure DOM node without events by default", () => {
            let listenerCount = 0;
            const originalCreateElement = globalThis.document.createElement;

            globalThis.document.createElement = (tag) => {
                const el = originalCreateElement(tag);
                el.addEventListener = (ev, fn) => {
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

            const element = buildSpecElement({ inSpec: spec });
            assert.ok(element);
            // By default inApplyEvents is false, so listenerCount should be 0
            assert.equal(listenerCount, 0);

            globalThis.document.createElement = originalCreateElement;
        });

        test("builds DOM node with events when inApplyEvents is true", () => {
            let registeredEvents = [];
            const originalCreateElement = globalThis.document.createElement;

            globalThis.document.createElement = (tag) => {
                const el = originalCreateElement(tag);
                el.addEventListener = (ev, fn) => {
                    registeredEvents.push(ev);
                };
                return el;
            };

            const spec = {
                tagName: "button",
                textContent: "Submit",
                events: {
                    click: () => {}
                }
            };

            buildSpecElement({ inSpec: spec, inApplyEvents: true });

            // Should have registered internal button click + declared click
            assert.ok(registeredEvents.includes("click"));
            assert.equal(registeredEvents.length, 2);

            globalThis.document.createElement = originalCreateElement;
        });

        test("buildSpecElementWithEvents helper binds events automatically", () => {
            let registeredEvents = [];
            const originalCreateElement = globalThis.document.createElement;

            globalThis.document.createElement = (tag) => {
                const el = originalCreateElement(tag);
                el.addEventListener = (ev, fn) => {
                    registeredEvents.push(ev);
                };
                return el;
            };

            const spec = {
                tagName: "input",
                attributes: { type: "text" },
                events: {
                    change: () => {}
                }
            };

            buildSpecElementWithEvents({ inSpec: spec });

            assert.ok(registeredEvents.includes("change"));
            assert.equal(registeredEvents.length, 1);

            globalThis.document.createElement = originalCreateElement;
        });
    });

    describe("2. Event Validation Story (1.validate)", () => {
        test("allows permitted events on buttons and inputs", () => {
            assert.equal(isEventAllowed({ inTagName: "button", inEventName: "click" }), true);
            assert.equal(isEventAllowed({ inTagName: "input", inEventName: "change" }), true);
            assert.equal(isEventAllowed({ inTagName: "input", inEventName: "input" }), true);
        });

        test("rejects unpermitted events", () => {
            assert.equal(isEventAllowed({ inTagName: "button", inEventName: "submit" }), false);
            assert.equal(isEventAllowed({ inTagName: "div", inEventName: "click" }), false);
            assert.equal(isEventAllowed({ inTagName: "table", inEventName: "change" }), false);
        });
    });

    describe("3. Internal Button Click Story (2.internal/buttonClick)", () => {
        test("getClosestTarget finds closest element matching dataset.closestTarget", () => {
            const mockTarget = {
                dataset: { closestTarget: "form-group" },
                closest: (selector) => {
                    if (selector === ".form-group") return { id: "found-target" };
                    return null;
                }
            };

            const target = getClosestTarget({ inTargetElement: mockTarget });
            assert.ok(target);
            assert.equal(target.id, "found-target");
        });

        test("applyHighlight adds highlight classes if dataset.highlight is 'true'", () => {
            const addedClasses = [];
            const mockTarget = {
                dataset: {
                    highlight: "true",
                    highlightClass: "border-primary bg-light"
                }
            };
            const mockClosest = {
                classList: {
                    add: (...cls) => addedClasses.push(...cls)
                }
            };

            applyHighlight({ inTargetElement: mockTarget, inClosestElement: mockClosest });
            assert.deepEqual(addedClasses, ["border-primary", "bg-light"]);
        });

        test("extractOutput gathers input name and value", () => {
            const mockClosest = {
                querySelector: (sel) => {
                    if (sel === "input") {
                        return { name: "username", value: "admin" };
                    }
                    return null;
                }
            };

            const output = extractOutput({ inClosestElement: mockClosest });
            assert.equal(output.name, "username");
            assert.equal(output.value, "admin");
            assert.ok(output.input);
        });

        test("handleButtonClick coordinates complete button interaction", () => {
            const mockEvent = {
                currentTarget: {
                    dataset: {
                        closestTarget: "row-item",
                        highlight: "true",
                        highlightClass: "highlighted"
                    },
                    closest: () => ({
                        classList: { add: () => {} },
                        querySelector: () => ({ name: "qty", value: "42" })
                    })
                }
            };

            handleButtonClick({ inEvent: mockEvent });
            assert.ok(mockEvent.output);
            assert.equal(mockEvent.output.name, "qty");
            assert.equal(mockEvent.output.value, "42");
        });
    });

    describe("4. Spec Validation in v10", () => {
        test("validates clean spec with permitted attributes and events", () => {
            const spec = {
                tagName: "button",
                textContent: "Click",
                attributes: {
                    type: "button",
                    class: "btn btn-primary",
                    id: "action-btn",
                    "data-action": "submit"
                },
                events: {
                    click: () => {}
                }
            };

            const result = validateSpec({ inSpec: spec });
            assert.equal(result.isValid, true);
            assert.equal(result.errors.length, 0);
        });
    });

    describe("5. Standalone applyEvents Story", () => {
        test("can be invoked directly on any element", () => {
            const registered = [];
            const mockElement = {
                addEventListener: (ev, fn) => registered.push(ev)
            };

            applyEvents({
                inElement: mockElement,
                inEvents: { click: () => {} },
                inTagName: "button"
            });

            // Wires internal button hook + declared click
            assert.equal(registered.length, 2);
            assert.ok(registered.includes("click"));
        });
    });

    describe("6. ClassList and Primitive Children Support", () => {
        test("classList array and string both apply properly", () => {
            const specString = {
                tagName: "div",
                classList: "card shadow-sm"
            };
            const el1 = buildSpecElement({ inSpec: specString });
            assert.deepEqual(el1.classList.classes, ["card", "shadow-sm"]);

            const specArray = {
                tagName: "div",
                classList: ["badge", "bg-success"]
            };
            const el2 = buildSpecElement({ inSpec: specArray });
            assert.deepEqual(el2.classList.classes, ["badge", "bg-success"]);
        });
    });
});
