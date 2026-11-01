import { describe, test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

import jsonToDom from "../index.js";

describe("@keshavsoft/json-to-dom v42 orchestrator", () => {
    let dom;
    let originalDocument;

    beforeEach(() => {
        dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app"></div></body></html>`);
        originalDocument = globalThis.document;
        globalThis.document = dom.window.document;
        globalThis.window = dom.window;
        globalThis.Node = dom.window.Node;
        globalThis.NodeList = dom.window.NodeList;
        globalThis.HTMLCollection = dom.window.HTMLCollection;
    });

    afterEach(() => {
        globalThis.document = originalDocument;
    });

    test("Exports orchestrator start function as default", () => {
        assert.equal(typeof jsonToDom, "function", "jsonToDom default export is a function");
    });

    test("Registers globalThis.ks.jsonToDom metadata", () => {
        assert.ok(globalThis.ks, "globalThis.ks exists");
        assert.ok(globalThis.ks.jsonToDom, "globalThis.ks.jsonToDom exists");
        assert.equal(globalThis.ks.jsonToDom.meta.name, "json-to-dom");
        assert.equal(globalThis.ks.jsonToDom.meta.version, "42.1.4");
    });

    test("Compiles JSON specification and mounts to target HTML ID", () => {
        const spec = {
            tagName: "div",
            classList: "card",
            children: [
                {
                    tagName: "h1",
                    textContent: "Hello Orchestrator"
                },
                {
                    tagName: "button",
                    textContent: "Click Me"
                }
            ]
        };

        const container = jsonToDom({
            jsonSpec: spec,
            targetHtmlId: "app"
        });

        assert.ok(container, "container returned");
        assert.equal(container.id, "app");
        assert.equal(container.children.length, 1);
        const card = container.children[0];
        assert.equal(card.tagName, "DIV");
        assert.ok(card.classList.contains("card"));
        assert.equal(card.children.length, 2);
        assert.equal(card.children[0].tagName, "H1");
        assert.equal(card.children[0].textContent, "Hello Orchestrator");
        assert.equal(card.children[1].tagName, "BUTTON");
        assert.equal(card.children[1].textContent, "Click Me");
    });
});
