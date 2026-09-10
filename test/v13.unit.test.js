import { describe, test } from "node:test";
import assert from "node:assert/strict";

import buildSpecElement from "../src/v13/index.js";
import validateTag from "../src/v13/validate/validateTag.js";
import { domToSpec, getStartSpec } from "../src/v13/reverse/index.js";

const createTextNode = (textContent) => ({
    nodeType: 3,
    textContent
});

const createCommentNode = (textContent = "ignored") => ({
    nodeType: 8,
    textContent
});

const createElementNode = ({ tagName, attributes = {}, children = [], value } = {}) => ({
    nodeType: 1,
    tagName: tagName.toUpperCase(),
    attributes: Object.entries(attributes).map(([name, currentValue]) => ({
        name,
        value: currentValue === true ? "" : String(currentValue)
    })),
    childNodes: children,
    ...(value !== undefined ? { value } : {})
});

class MockNode {
}

class MockElement extends MockNode {
    constructor(tagName) {
        super();
        this.tagName = tagName.toUpperCase();
        this.className = "";
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

    setAttribute(key, value) {
        this.attributes[key] = value;
    }

    removeAttribute(key) {
        delete this.attributes[key];
    }

    appendChild(child) {
        this.children.push(child);
    }

    addEventListener() {
    }
}

class MockTextNode extends MockNode {
    constructor(textContent) {
        super();
        this.nodeType = 3;
        this.textContent = textContent;
    }
}

const installMockBuildDocument = () => {
    const originalNode = globalThis.Node;
    const originalDocument = globalThis.document;

    globalThis.Node = MockNode;
    globalThis.document = {
        createElement: (tagName) => new MockElement(tagName),
        createTextNode: (textContent) => new MockTextNode(textContent)
    };

    return () => {
        if (originalNode === undefined) {
            delete globalThis.Node;
        } else {
            globalThis.Node = originalNode;
        }

        if (originalDocument === undefined) {
            delete globalThis.document;
        } else {
            globalThis.document = originalDocument;
        }
    };
};

describe("v13 Reverse DOM -> Spec utilities", () => {
    test("validateTag recognizes tags added for the #start reverse round-trip", () => {
        ["form", "select", "p", "h2"].forEach((currentTagName) => {
            const result = validateTag({ inTagName: currentTagName });
            assert.equal(result.isValid, true);
            assert.equal(result.tagName, currentTagName);
        });
    });

    test("buildSpecElement accepts the newly registered start-related tags", () => {
        const restoreGlobals = installMockBuildDocument();

        try {
            const spec = {
                tagName: "form",
                attributes: { class: "space-y-4" },
                children: [
                    { tagName: "h2", textContent: "Account Information" },
                    { tagName: "p", textContent: "Please fill in your details." },
                    {
                        tagName: "select",
                        attributes: { id: "role" },
                        children: [
                            { tagName: "option", textContent: "Developer" },
                            { tagName: "option", textContent: "Designer" }
                        ]
                    }
                ]
            };

            const actual = buildSpecElement({ inSpec: spec, inApplyEvents: false });

            assert.ok(actual);
            assert.equal(actual.tagName, "FORM");
            assert.equal(actual.className, "space-y-4");
            assert.equal(actual.children.length, 3);
            assert.equal(actual.children[0].tagName, "H2");
            assert.equal(actual.children[0].textContent, "Account Information");
            assert.equal(actual.children[1].tagName, "P");
            assert.equal(actual.children[1].textContent, "Please fill in your details.");
            assert.equal(actual.children[2].tagName, "SELECT");
            assert.equal(actual.children[2].attributes.id, "role");
            assert.equal(actual.children[2].children.length, 2);
            assert.equal(actual.children[2].children[0].tagName, "OPTION");
            assert.equal(actual.children[2].children[0].textContent, "Developer");
        } finally {
            restoreGlobals();
        }
    });

    test("domToSpec ignores whitespace and comments while preserving mixed content order", () => {
        const localNode = createElementNode({
            tagName: "div",
            attributes: { class: "wrapper" },
            children: [
                createTextNode("  Hello  "),
                createCommentNode(),
                createTextNode("   "),
                createElementNode({
                    tagName: "span",
                    children: [createTextNode("World")]
                }),
                createTextNode(" ! ")
            ]
        });

        const actual = domToSpec({ inNode: localNode });

        assert.deepEqual(actual, {
            tagName: "div",
            attributes: { class: "wrapper" },
            children: [
                "Hello",
                { tagName: "span", textContent: "World" },
                "!"
            ]
        });
    });

    test("getStartSpec converts src/v13/index.html's #start tree into nested json-to-dom spec", () => {
        const startElement = createElementNode({
            tagName: "div",
            attributes: {
                id: "start",
                class: "max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            },
            children: [
                createTextNode("\n        "),
                createCommentNode("Header"),
                createTextNode("\n        "),
                createElementNode({
                    tagName: "div",
                    attributes: { class: "px-6 py-4 bg-gray-50 border-b border-gray-200" },
                    children: [
                        createTextNode("\n            "),
                        createElementNode({
                            tagName: "h2",
                            attributes: { class: "text-xl font-semibold text-gray-800" },
                            children: [createTextNode("Account Information")]
                        }),
                        createTextNode("\n            "),
                        createElementNode({
                            tagName: "p",
                            attributes: { class: "text-sm text-gray-500 mt-1" },
                            children: [createTextNode("Please fill in your details to update your profile.")]
                        }),
                        createTextNode("\n        ")
                    ]
                }),
                createTextNode("\n\n        "),
                createCommentNode("Body"),
                createTextNode("\n        "),
                createElementNode({
                    tagName: "form",
                    attributes: { class: "p-6 space-y-4" },
                    children: [
                        createTextNode("\n            "),
                        createElementNode({
                            tagName: "div",
                            children: [
                                createTextNode("\n                "),
                                createElementNode({
                                    tagName: "label",
                                    attributes: {
                                        class: "block text-sm font-medium text-gray-700 mb-1",
                                        for: "name"
                                    },
                                    children: [createTextNode("Full Name")]
                                }),
                                createTextNode("\n                "),
                                createElementNode({
                                    tagName: "input",
                                    attributes: {
                                        type: "text",
                                        id: "name",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                        placeholder: "John Doe"
                                    }
                                }),
                                createTextNode("\n            ")
                            ]
                        }),
                        createTextNode("\n\n            "),
                        createElementNode({
                            tagName: "div",
                            children: [
                                createTextNode("\n                "),
                                createElementNode({
                                    tagName: "label",
                                    attributes: {
                                        class: "block text-sm font-medium text-gray-700 mb-1",
                                        for: "email"
                                    },
                                    children: [createTextNode("Email Address")]
                                }),
                                createTextNode("\n                "),
                                createElementNode({
                                    tagName: "input",
                                    attributes: {
                                        type: "email",
                                        id: "email",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                        placeholder: "you@example.com"
                                    }
                                }),
                                createTextNode("\n            ")
                            ]
                        }),
                        createTextNode("\n\n            "),
                        createElementNode({
                            tagName: "div",
                            children: [
                                createTextNode("\n                "),
                                createElementNode({
                                    tagName: "label",
                                    attributes: {
                                        class: "block text-sm font-medium text-gray-700 mb-1",
                                        for: "role"
                                    },
                                    children: [createTextNode("Role")]
                                }),
                                createTextNode("\n                "),
                                createElementNode({
                                    tagName: "select",
                                    attributes: {
                                        id: "role",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    },
                                    children: [
                                        createTextNode("\n                    "),
                                        createElementNode({
                                            tagName: "option",
                                            children: [createTextNode("Developer")]
                                        }),
                                        createTextNode("\n                    "),
                                        createElementNode({
                                            tagName: "option",
                                            children: [createTextNode("Designer")]
                                        }),
                                        createTextNode("\n                    "),
                                        createElementNode({
                                            tagName: "option",
                                            children: [createTextNode("Manager")]
                                        }),
                                        createTextNode("\n                ")
                                    ]
                                }),
                                createTextNode("\n            ")
                            ]
                        }),
                        createTextNode("\n        ")
                    ]
                }),
                createTextNode("\n\n        "),
                createCommentNode("Footer"),
                createTextNode("\n        "),
                createElementNode({
                    tagName: "div",
                    attributes: { class: "px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3" },
                    children: [
                        createTextNode("\n            "),
                        createElementNode({
                            tagName: "button",
                            attributes: {
                                type: "button",
                                class: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            },
                            children: [createTextNode("\n                Cancel\n            ")]
                        }),
                        createTextNode("\n            "),
                        createElementNode({
                            tagName: "button",
                            attributes: {
                                type: "submit",
                                class: "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            },
                            children: [createTextNode("\n                Save Changes\n            ")]
                        }),
                        createTextNode("\n        ")
                    ]
                }),
                createTextNode("\n    ")
            ]
        });

        const mockDocument = {
            getElementById: (id) => id === "start" ? startElement : null
        };

        const actual = getStartSpec({ inDocument: mockDocument });

        assert.deepEqual(actual, {
            tagName: "div",
            attributes: {
                id: "start",
                class: "max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            },
            children: [
                {
                    tagName: "div",
                    attributes: { class: "px-6 py-4 bg-gray-50 border-b border-gray-200" },
                    children: [
                        {
                            tagName: "h2",
                            attributes: { class: "text-xl font-semibold text-gray-800" },
                            textContent: "Account Information"
                        },
                        {
                            tagName: "p",
                            attributes: { class: "text-sm text-gray-500 mt-1" },
                            textContent: "Please fill in your details to update your profile."
                        }
                    ]
                },
                {
                    tagName: "form",
                    attributes: { class: "p-6 space-y-4" },
                    children: [
                        {
                            tagName: "div",
                            children: [
                                {
                                    tagName: "label",
                                    attributes: {
                                        class: "block text-sm font-medium text-gray-700 mb-1",
                                        for: "name"
                                    },
                                    textContent: "Full Name"
                                },
                                {
                                    tagName: "input",
                                    attributes: {
                                        type: "text",
                                        id: "name",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                        placeholder: "John Doe"
                                    }
                                }
                            ]
                        },
                        {
                            tagName: "div",
                            children: [
                                {
                                    tagName: "label",
                                    attributes: {
                                        class: "block text-sm font-medium text-gray-700 mb-1",
                                        for: "email"
                                    },
                                    textContent: "Email Address"
                                },
                                {
                                    tagName: "input",
                                    attributes: {
                                        type: "email",
                                        id: "email",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                        placeholder: "you@example.com"
                                    }
                                }
                            ]
                        },
                        {
                            tagName: "div",
                            children: [
                                {
                                    tagName: "label",
                                    attributes: {
                                        class: "block text-sm font-medium text-gray-700 mb-1",
                                        for: "role"
                                    },
                                    textContent: "Role"
                                },
                                {
                                    tagName: "select",
                                    attributes: {
                                        id: "role",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    },
                                    children: [
                                        { tagName: "option", textContent: "Developer" },
                                        { tagName: "option", textContent: "Designer" },
                                        { tagName: "option", textContent: "Manager" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    tagName: "div",
                    attributes: { class: "px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3" },
                    children: [
                        {
                            tagName: "button",
                            attributes: {
                                type: "button",
                                class: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            },
                            textContent: "Cancel"
                        },
                        {
                            tagName: "button",
                            attributes: {
                                type: "submit",
                                class: "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            },
                            textContent: "Save Changes"
                        }
                    ]
                }
            ]
        });
    });
});
