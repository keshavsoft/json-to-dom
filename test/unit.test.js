import { test, describe } from "node:test";
import assert from "node:assert/strict";

import validateTag from "../src/v7/validate/validateTag.js";
import validateSpec from "../src/v7/validate/validateSpec.js";

describe("v7 Validation & Tester Suite", () => {

    describe("1. validateTag ({ inTagName, inSpec })", () => {
        test("accepts valid tag name string", () => {
            const result = validateTag({ inTagName: "input" });
            assert.equal(result.isValid, true);
            assert.equal(result.tagName, "input");
            assert.ok(result.definition);
            assert.equal(result.definition.allowsChildren, false);
            assert.equal(result.definition.allowsTextContent, false);
            assert.ok(result.definition.allowedAttributes.includes("placeholder"));
        });

        test("accepts valid tag from inSpec object", () => {
            const result = validateTag({ inSpec: { tagName: "table" } });
            assert.equal(result.isValid, true);
            assert.equal(result.tagName, "table");
            assert.equal(result.definition.allowsChildren, true);
        });

        test("rejects invalid/unknown HTML tags", () => {
            const result = validateTag({ inTagName: "custom-component-xyz" });
            assert.equal(result.isValid, false);
            assert.ok(result.error.includes("not recognized"));
        });

        test("rejects missing tag name", () => {
            const result = validateTag({ inTagName: null });
            assert.equal(result.isValid, false);
            assert.equal(result.error, "Missing tagName");
        });
    });

    describe("2. validateSpec ({ inSpec }) - Article Keys & Rules", () => {
        test("passes a completely valid input spec", () => {
            const spec = {
                tagName: "input",
                attributes: {
                    type: "text",
                    placeholder: "Search items...",
                    class: "form-control",
                    id: "search-box"
                }
            };

            const result = validateSpec({ inSpec: spec });
            assert.equal(result.isValid, true);
            assert.equal(result.errors.length, 0);
            assert.equal(result.warnings.length, 0);
        });

        test("passes valid Table cell spec with scoped layout attributes", () => {
            const thSpec = {
                tagName: "th",
                textContent: "Total Amount",
                attributes: {
                    scope: "col",
                    colspan: 2,
                    class: "text-end fw-bold"
                }
            };

            const result = validateSpec({ inSpec: thSpec });
            assert.equal(result.isValid, true);
            assert.equal(result.errors.length, 0);
        });

        test("flags warning when unknown top-level keys are supplied in article", () => {
            const spec = {
                tagName: "div",
                arbitraryKey: "unexpectedValue",
                anotherUnknownKey: 42
            };

            const result = validateSpec({ inSpec: spec });
            assert.equal(result.isValid, true); // Still valid if no errors, but has warnings
            assert.equal(result.unknownKeys.length, 2);
            assert.ok(result.unknownKeys.includes("arbitraryKey"));
            assert.ok(result.unknownKeys.includes("anotherUnknownKey"));
            assert.equal(result.warnings.length, 2);
        });

        test("flags error when textContent is supplied to element with allowsTextContent: false", () => {
            const spec = {
                tagName: "input",
                textContent: "Illegal Text Inside Input",
                attributes: { type: "text" }
            };

            const result = validateSpec({ inSpec: spec });
            assert.equal(result.isValid, false);
            assert.ok(result.errors.some(err => err.includes("does not allow textContent")));
        });

        test("flags error when children are supplied to void element (allowsChildren: false)", () => {
            const spec = {
                tagName: "input",
                attributes: { type: "text" },
                children: [
                    { tagName: "span", textContent: "Illegal Child Node" }
                ]
            };

            const result = validateSpec({ inSpec: spec });
            assert.equal(result.isValid, false);
            assert.ok(result.errors.some(err => err.includes("void element and does not allow children")));
        });

        test("flags error when illegal attribute is supplied to tag", () => {
            const spec = {
                tagName: "input",
                attributes: {
                    type: "text",
                    colspan: 3, // Illegal on input! Only valid on th/td
                    border: "1"  // Illegal on input!
                }
            };

            const result = validateSpec({ inSpec: spec });
            assert.equal(result.isValid, false);
            assert.equal(result.invalidAttributes.length, 2);
            assert.ok(result.invalidAttributes.includes("colspan"));
            assert.ok(result.invalidAttributes.includes("border"));
            assert.ok(result.errors.some(err => err.includes('Attribute "colspan" is not allowed')));
        });
    });
});
