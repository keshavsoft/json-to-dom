import { test, describe } from "node:test";
import assert from "node:assert/strict";

import isEventAllowed from "../src/v9/validate/isEventAllowed.js";
import validateSpec from "../src/v9/validate/validateSpec.js";
import applyEvents from "../src/v9/elementBuilder/5.applyEvents.js";
import allowedEvents from "../docs/tags/allowedEvents.json" with { type: "json" };

describe("v9 Allowed Events & Guarding Suite", () => {
    describe("1. isEventAllowed({ inTagName, inEventName })", () => {
        test("allows 'click' on 'button'", () => {
            const result = isEventAllowed({ inTagName: "button", inEventName: "click" });
            assert.equal(result, true);
        });

        test("allows 'change' on 'input'", () => {
            const result = isEventAllowed({ inTagName: "input", inEventName: "change" });
            assert.equal(result, true);
        });

        test("allows 'input' on 'textarea'", () => {
            const result = isEventAllowed({ inTagName: "textarea", inEventName: "input" });
            assert.equal(result, true);
        });

        test("allows 'submit' on 'form'", () => {
            const result = isEventAllowed({ inTagName: "form", inEventName: "submit" });
            assert.equal(result, true);
        });

        test("rejects events on non-control elements (e.g. 'div', 'table')", () => {
            assert.equal(isEventAllowed({ inTagName: "div", inEventName: "click" }), false);
            assert.equal(isEventAllowed({ inTagName: "table", inEventName: "click" }), false);
            assert.equal(isEventAllowed({ inTagName: "tr", inEventName: "change" }), false);
        });

        test("rejects non-permitted event types on permitted controls (e.g. 'submit' on 'button')", () => {
            assert.equal(isEventAllowed({ inTagName: "button", inEventName: "submit" }), false);
        });

        test("handles case-insensitivity gracefully", () => {
            assert.equal(isEventAllowed({ inTagName: "BUTTON", inEventName: "CLICK" }), true);
            assert.equal(isEventAllowed({ inTagName: "Input", inEventName: "Change" }), true);
        });

        test("handles missing or invalid inputs", () => {
            assert.equal(isEventAllowed({ inTagName: null, inEventName: "click" }), false);
            assert.equal(isEventAllowed({ inTagName: "button", inEventName: null }), false);
            assert.equal(isEventAllowed({}), false);
        });
    });

    describe("2. validateSpec ({ inSpec }) - Event Validation", () => {
        test("passes valid button spec with click event", () => {
            const spec = {
                tagName: "button",
                textContent: "Click Me",
                events: {
                    click: () => {}
                }
            };
            const result = validateSpec({ inSpec: spec });
            assert.equal(result.isValid, true);
            assert.equal(result.warnings.length, 0);
            assert.equal(result.invalidEvents.length, 0);
        });

        test("warns and records invalidEvents when events attached to div", () => {
            const spec = {
                tagName: "div",
                events: {
                    click: () => {}
                }
            };
            const result = validateSpec({ inSpec: spec });
            assert.equal(result.invalidEvents.includes("click"), true);
            assert.ok(result.warnings.some(w => w.includes('Event "click" is not permitted on <div>')));
        });

        test("warns when unpermitted event is attached to button", () => {
            const spec = {
                tagName: "button",
                events: {
                    submit: () => {}
                }
            };
            const result = validateSpec({ inSpec: spec });
            assert.equal(result.invalidEvents.includes("submit"), true);
            assert.ok(result.warnings.some(w => w.includes('Event "submit" is not permitted on <button>')));
        });
    });

    describe("3. applyEvents ({ inElement, inEvents, inTagName, inShowLog })", () => {
        test("hooks permitted event listener to element mock", () => {
            const listeners = [];
            const mockElement = {
                addEventListener: (event, handler) => {
                    listeners.push({ event, handler });
                }
            };
            const changeHandler = () => "changed";

            applyEvents({
                inElement: mockElement,
                inEvents: { change: changeHandler },
                inTagName: "input"
            });

            assert.equal(listeners.length, 1);
            assert.equal(listeners[0].event, "change");
            assert.equal(listeners[0].handler, changeHandler);
        });

        test("hooks native button click plus declared click on button", () => {
            const listeners = [];
            const mockElement = {
                addEventListener: (event, handler) => {
                    listeners.push({ event, handler });
                }
            };
            const clickHandler = () => "clicked";

            applyEvents({
                inElement: mockElement,
                inEvents: { click: clickHandler },
                inTagName: "button"
            });

            assert.equal(listeners.length, 2);
            assert.ok(listeners.some(l => l.event === "click" && l.handler === clickHandler));
        });

        test("discards non-permitted event listener on div", () => {
            const listeners = [];
            const mockElement = {
                addEventListener: (event, handler) => {
                    listeners.push({ event, handler });
                }
            };

            applyEvents({
                inElement: mockElement,
                inEvents: { click: () => {} },
                inTagName: "div"
            });

            assert.equal(listeners.length, 0);
        });

        test("discards unpermitted event type on button", () => {
            const listeners = [];
            const mockElement = {
                addEventListener: (event, handler) => {
                    listeners.push({ event, handler });
                }
            };

            applyEvents({
                inElement: mockElement,
                inEvents: { submit: () => {} },
                inTagName: "button"
            });

            // Only localButtonClick is attached; submit is rejected
            assert.equal(listeners.length, 1);
            assert.equal(listeners.some(l => l.event === "submit"), false);
        });
    });
});
