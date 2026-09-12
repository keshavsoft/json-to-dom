import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
    resolvePath,
    setNestedValue,
    applyBindings,
    executeInstruction,
    resolveSpec
} from "../instructionEngine/index.js";

import {
    sampleStructure,
    sampleInstructions,
    sampleData
} from "../samples/defaultSamples.js";

describe("src/v15 Declarative Instruction Engine Tests", () => {
    test("resolvePath correctly traverses nested keys and arrays", () => {
        const testData = {
            title: "Hello",
            meta: { author: { name: "Keshav" } },
            items: [{ id: 1 }, { id: 2, title: "Second" }]
        };

        assert.equal(resolvePath({ inData: testData, inPath: "title" }), "Hello");
        assert.equal(resolvePath({ inData: testData, inPath: "meta.author.name" }), "Keshav");
        assert.equal(resolvePath({ inData: testData, inPath: "items.1.title" }), "Second");
        assert.equal(resolvePath({ inData: testData, inPath: "non.existent.path" }), undefined);
        assert.deepEqual(resolvePath({ inData: testData, inPath: "" }), testData);
    });

    test("setNestedValue creates deep paths safely", () => {
        const target = {};
        setNestedValue({ inTarget: target, inPath: "attributes.data-id", inValue: "USR-100" });
        assert.equal(target.attributes["data-id"], "USR-100");

        setNestedValue({ inTarget: target, inPath: "textContent", inValue: "Welcome" });
        assert.equal(target.textContent, "Welcome");
    });

    test("applyBindings applies direct values and template string interpolations with tags.json compliance", () => {
        const template = {
            tagName: "span",
            attributes: { class: "badge" },
            textContent: ""
        };

        const dataItem = {
            name: "Alice",
            role: "Developer",
            score: 98
        };

        const bindings = {
            "textContent": "${name} is a ${role}",
            "attributes.data-score": "score"
        };

        const result = applyBindings({
            inNodeTemplate: template,
            inDataItem: dataItem,
            inBindings: bindings
        });

        assert.equal(result.textContent, "Alice is a Developer");
        assert.equal(result.attributes["data-score"], 98);
        assert.equal(result.attributes.class, "badge");
    });

    test("executeInstruction handles loops with bindings conforming to tags.json", () => {
        const loopInstruction = {
            type: "loop",
            dataPath: "users",
            itemTemplate: {
                tagName: "li",
                attributes: { class: "item" },
                bindings: {
                    "textContent": "name",
                    "attributes.data-idx": "$index"
                }
            }
        };

        const payload = {
            users: [
                { name: "Alpha" },
                { name: "Beta" }
            ]
        };

        const result = executeInstruction({
            inInstruction: loopInstruction,
            inData: payload
        });

        assert.equal(Array.isArray(result), true);
        assert.equal(result.length, 2);
        assert.equal(result[0].tagName, "li");
        assert.equal(result[0].textContent, "Alpha");
        assert.equal(result[0].attributes["data-idx"], 0);
        assert.equal(result[1].textContent, "Beta");
        assert.equal(result[1].attributes["data-idx"], 1);
    });

    test("executeInstruction handles conditional branches", () => {
        const condInstruction = {
            type: "conditional",
            dataPath: "isAdmin",
            condition: { operator: "truthy" },
            thenTemplate: {
                tagName: "span",
                textContent: "Admin Badge"
            },
            elseTemplate: {
                tagName: "span",
                textContent: "User Badge"
            }
        };

        const adminResult = executeInstruction({
            inInstruction: condInstruction,
            inData: { isAdmin: true }
        });
        assert.equal(adminResult.textContent, "Admin Badge");

        const userResult = executeInstruction({
            inInstruction: condInstruction,
            inData: { isAdmin: false }
        });
        assert.equal(userResult.textContent, "User Badge");
    });

    test("resolveSpec integrates structure.json, instructions.json, and data.json end-to-end with tags.json compliance", () => {
        const resolved = resolveSpec({
            inStructure: sampleStructure,
            inInstructions: sampleInstructions,
            inData: sampleData
        });

        // Top level container
        assert.equal(resolved.tagName, "div");
        assert.equal(resolved.attributes.class.includes("max-w-2xl"), true);
        assert.equal(resolved.children.length, 2);

        // Header child (resolved through bindHeader instruction)
        const header = resolved.children[0];
        assert.equal(header.tagName, "div");
        assert.equal(header.children[0].textContent, "Team Directory");
        assert.match(header.children[1].textContent, /Showing 3 team members/);

        // Members list container (resolved through renderMemberList loop)
        const memberList = resolved.children[1];
        assert.equal(memberList.tagName, "div");
        assert.equal(memberList.children.length, 3);

        // Verify first member card
        const firstCard = memberList.children[0];
        assert.equal(firstCard.tagName, "div");
        
        // Avatar img
        const avatarImg = firstCard.children[0].children[0];
        assert.equal(avatarImg.tagName, "img");
        assert.equal(avatarImg.attributes.alt, "Alex Morgan");
        assert.match(avatarImg.attributes.src, /seed=Alex/);

        // Name and role
        const textContainer = firstCard.children[0].children[1];
        assert.equal(textContainer.children[0].textContent, "Alex Morgan");
        assert.equal(textContainer.children[1].textContent, "Lead Architect • alex@example.com");

        // Status badge
        const badge = firstCard.children[1];
        assert.equal(badge.textContent, "Active");
        assert.equal(badge.attributes["data-status"], "Active");

        // Ensure instruction references are cleanly stripped from the final spec
        assert.equal(resolved.instruction, undefined);
        assert.equal(header.instruction, undefined);
        assert.equal(memberList.instruction, undefined);
    });
});
