# @keshavsoft/json-to-dom

> **Zero-dependency DOM orchestrator** compiling declarative JSON specifications into live browser DOM trees by coordinating [`@keshavsoft/json-to-tag`](https://www.npmjs.com/package/@keshavsoft/json-to-tag) and [`spec-to-dom`](https://www.npmjs.com/package/spec-to-dom).

[![npm version](https://img.shields.io/npm/v/@keshavsoft/json-to-dom.svg)](https://www.npmjs.com/package/@keshavsoft/json-to-dom)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](https://www.npmjs.com/package/@keshavsoft/json-to-dom)

---

## 🏛️ Architecture: The Two-Engine Orchestrator

`@keshavsoft/json-to-dom` is the high-level orchestration facade of the KeshavSoft DOM generation ecosystem. Rather than mixing tag creation and DOM mounting into a monolithic codebase, it cleanly coordinates two specialized sibling engines:

```
          JSON Specification (Data Contract)
                         │
                         ▼
   ┌─────────────────────────────────────────────────────────┐
   │            @keshavsoft/json-to-dom                      │
   │                                                         │
   │  1. jsonToTag(jsonSpec)                                 │
   │     └──► @keshavsoft/json-to-tag                        │
   │          (W3C Node Synthesis & Validation)              │
   │                                                         │
   │  2. specToDom({ buildSpec, targetHtmlId, ... })         │
   │     └──► spec-to-dom                                    │
   │          (Target Container Resolution & Safe Mounting)  │
   └─────────────────────────────────────────────────────────┘
                         │
                         ▼
              Native Browser DOM Tree
```

### The Two Subordinate Engines:

1. **Tag Synthesis Engine &mdash; [`@keshavsoft/json-to-tag`](https://www.npmjs.com/package/@keshavsoft/json-to-tag)** ([GitHub](https://github.com/keshavsoft/json-to-tag))
   - Traverses declarative JSON specifications.
   - Validates tag names, allowed attributes, and W3C grammar.
   - Synthesizes real browser DOM elements and SVG namespaces via `document.createElement` / `document.createElementNS`.
2. **Mount Engine &mdash; [`spec-to-dom`](https://www.npmjs.com/package/spec-to-dom)** ([GitHub](https://github.com/keshavsoft/spec-to-dom))
   - Resolves target container elements by HTML ID (`document.getElementById`).
   - Handles single nodes, arrays, `NodeList`, and `HTMLCollection`.
   - Safely mounts synthesized nodes (`append`, `prepend`, or clean replace) without risky `innerHTML` injection.

---

## 📦 Installation

```bash
npm install @keshavsoft/json-to-dom
```

Dependencies (`@keshavsoft/json-to-tag` and `spec-to-dom`) are installed automatically.

### CDN / Direct Browser Usage

```html
<script type="module">
  import jsonToDom from "https://cdn.jsdelivr.net/npm/@keshavsoft/json-to-dom/docs/dist/v42/min.js";

  jsonToDom({
    jsonSpec: {
      tagName: "div",
      classList: "p-4 bg-blue-50 text-blue-900 rounded-lg shadow",
      children: [
        { tagName: "h3", textContent: "Live via CDN" },
        { tagName: "p", textContent: "Rendered dynamically without Virtual DOM." }
      ]
    },
    targetHtmlId: "app"
  });
</script>
```

---

## 🚀 Quick Start & API

### Master Function Signature

```javascript
import jsonToDom from "@keshavsoft/json-to-dom";

const container = jsonToDom({
  jsonSpec,        // [Required] Object | Array: Declarative JSON element spec
  targetHtmlId,    // [Required] String: ID of the target DOM element
  appendPosition,  // [Optional] "append" (default) | "prepend"
  showLog          // [Optional] Boolean: Enable console debugging
});
```

### 1. Basic Component

```javascript
import jsonToDom from "@keshavsoft/json-to-dom";

jsonToDom({
  jsonSpec: {
    tagName: "div",
    classList: "card p-4 shadow-sm",
    children: [
      { tagName: "h4", textContent: "User Profile" },
      { tagName: "p", textContent: "Zero-dependency declarative rendering." }
    ]
  },
  targetHtmlId: "profile-container"
});
```

### 2. Form Input Row

```javascript
import jsonToDom from "@keshavsoft/json-to-dom";

jsonToDom({
  jsonSpec: {
    tagName: "div",
    classList: "flex items-center space-x-2 my-2",
    children: [
      {
        tagName: "label",
        textContent: "Email Address:",
        attributes: { for: "user-email" },
        classList: "font-semibold text-sm"
      },
      {
        tagName: "input",
        attributes: {
          id: "user-email",
          type: "email",
          placeholder: "name@example.com"
        },
        classList: "border px-3 py-1.5 rounded text-sm"
      },
      {
        tagName: "button",
        textContent: "Submit",
        attributes: { type: "button" },
        classList: "bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
      }
    ]
  },
  targetHtmlId: "form-container"
});
```

### 3. Rendering Collections (Tables & Lists)

You can pass an array of element specifications:

```javascript
import jsonToDom from "@keshavsoft/json-to-dom";

const rowsSpec = [
  {
    tagName: "tr",
    children: [
      { tagName: "td", textContent: "#101" },
      { tagName: "td", textContent: "Alpha Widget" },
      { tagName: "td", textContent: "$49.00" }
    ]
  },
  {
    tagName: "tr",
    children: [
      { tagName: "td", textContent: "#102" },
      { tagName: "td", textContent: "Beta Gadget" },
      { tagName: "td", textContent: "$89.00" }
    ]
  }
];

jsonToDom({
  jsonSpec: rowsSpec,
  targetHtmlId: "table-tbody"
});
```

---

## 🌐 Global Browser Registration

When bundled or included in a `<script>` tag, the engine automatically registers onto `globalThis.ks`:

```javascript
// Access orchestrator metadata & mount function:
console.log(window.ks.jsonToDom.meta);
// { version: "42.1.4", name: "json-to-dom" }

window.ks.jsonToDom.appendToDom({
  jsonSpec: { tagName: "h1", textContent: "Mounted via Global!" },
  targetHtmlId: "root"
});
```

---

## 🔗 Related Ecosystem Repositories

| Repository | Role | NPM Package |
| :--- | :--- | :--- |
| **[`@keshavsoft/json-to-dom`](https://github.com/keshavsoft/json-to-dom)** | **Master DOM Orchestrator** | [`@keshavsoft/json-to-dom`](https://www.npmjs.com/package/@keshavsoft/json-to-dom) |
| **[`@keshavsoft/json-to-tag`](https://github.com/keshavsoft/json-to-tag)** | **W3C Tag Specification Engine** | [`@keshavsoft/json-to-tag`](https://www.npmjs.com/package/@keshavsoft/json-to-tag) |
| **[`spec-to-dom`](https://github.com/keshavsoft/spec-to-dom)** | **Native DOM Mount Engine** | [`spec-to-dom`](https://www.npmjs.com/package/spec-to-dom) |
| **[`json-renderers`](https://github.com/keshavsoft/json-renderers)** | **Composite UI Component Renderers** | [`json-renderers`](https://www.npmjs.com/package/json-renderers) |
| **[`dom-builder`](https://keshavsoft.github.io/dom-builder/)** | **Interactive Showcase & Documentation Portal** | &mdash; |

---

## 🧪 Testing & Building

```bash
# Run unit tests
npm test

# Build production bundle with Vite
npm run build
```

---

## 📄 License

[ISC](LICENSE) © [KeshavSoft](https://github.com/keshavsoft)
