# JSON to DOM (`dom-builder-from-json`)

> **Declarative, zero-dependency JSON-to-DOM creation engine for modern web interfaces.**

[🌐 **Live Docs Website**](https://keshavsoft.github.io/json-to-dom/) &bull; 
[📝 **Form Alignment Styles**](https://keshavsoft.github.io/json-to-dom/samples/forms/) &bull; 
[💡 **Samples Gallery**](https://keshavsoft.github.io/json-to-dom/samples/) &bull; 
[⚡ **Live Engine Demo**](https://keshavsoft.github.io/json-to-dom/demo.html) &bull; 
[🏗️ **Architecture Guide**](https://keshavsoft.github.io/json-to-dom/architecture-and-pipeline.html)

`json-to-dom` is a lightweight, pure JavaScript engine that converts declarative JSON specifications into live browser DOM element trees. It enforces a strict architectural boundary between the **JSON Specification World** (serializable, transformable data) and the **DOM World** (browser element instances and events).

---

## 🌟 Key Highlights

- ⚡ **Zero Dependencies**: Pure native DOM APIs (`document.createElement`, `classList`, `setAttribute`, `addEventListener`).
- 🧩 **Strict Architectural Separation**: UI is defined and manipulated as pure data until the final recursive render stage.
- 🔁 **Recursive & Fragment Friendly**: Seamlessly builds single elements, complex nested trees, arrays of root nodes, or mixes in existing DOM nodes.
- 📐 **Standardized Codebase Architecture**: Every function adheres to KeshavSoft's parameter naming convention (`{ in... }` arguments mapped directly to `local...` variables).
- 🎨 **Theme & Pipeline Ready**: Designed to pair with transformation pipelines for themes, filters, dynamic columns, and data hydration.

---

## 📁 Repository Structure

```text
json-to-dom/
├── index.html                          # Root landing page (links to demo & docs portal)
├── README.md                           # Main project overview & quickstart (this file)
├── DETAILS.md                          # Comprehensive runtime architecture & pipeline concept
├── docs/
│   ├── index.html                      # Minimalist documentation gateway
│   ├── architecture-and-pipeline.html  # Runtime architecture & compiler pipeline
│   ├── spec-schema-and-guide.html      # Specification schema & properties guide
│   ├── demo.html                       # Live v7 browser compiler playground
│   ├── tags/                           # W3C grammar specs & element guides
│   │   ├── tags.json                   # Tag-specific grammar dictionary
│   │   ├── globalAllowedAttributes.json# Standard W3C/WHATWG global attributes & wildcards (v8+)
│   │   └── html/                       # HTML element deep-dive guides (label.html, etc.)
│   ├── dist/v8/min.js                  # Latest production bundle (v8)
│   └── samples/                        # Categorized standalone sample pages
│       ├── index.html                  # Master samples directory
│       ├── forms/                      # Form label/input alignment styles (01-05)
│       ├── cards/                      # Card & container components
│       ├── tables/                     # Data grids & financial tables
│       ├── interactive/                # Interactive counters & dynamic CRUD
│       └── dashboards/                 # Complex dashboard layouts
├── package.json
└── src/
    ├── v7/                             # v7 Modular engine & validator
    └── v8/                             # Latest engine with Two-Tier Global Attribute resolution
        ├── buildSpec/                  # Spec validation & traversal
        ├── elementBuilder/             # Native DOM construction & binding
        └── validate/                   # isAttributeAllowed, filterAttributes, validateSpec
```

---

## 🚀 Quick Start

### 1. Run the Local Demo

You can preview the live rendered DOM with any local static server:

```bash
# Using npx serve
npx serve

# Or using npm run dev
npm run dev
```

Then open your browser at `http://localhost:3000/` or directly at `http://localhost:3000/src/v2/`.

### 2. Basic Usage in JavaScript

```javascript
import { buildSpecElement } from "./src/v2/build/buildSpecElement.js";

// 1. Define your declarative JSON UI specification
const buttonSpec = {
    tagName: "button",
    textContent: "Click Me",
    attributes: {
        type: "button",
        class: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    },
    events: {
        click: (e) => alert("Button clicked!")
    }
};

// 2. Build real DOM elements
const domButton = buildSpecElement({ inSpec: buttonSpec });

// 3. Append to your target container
document.getElementById("app").appendChild(domButton);
```

---

## 🏗️ How It Works at a Glance

The engine executes in two distinct phases:

```
[ JSON Specification ]
         │
         ▼
buildSpecElement({ inSpec })  ──► Validates spec type (Null, Node, Array, or Object)
         │
         ├─► [Array of Specs] ──► buildSpecArray() ──► maps items recursively
         │
         └─► [Single Spec]    ──► buildSingleElement()
                                         │
                                         ▼
                                buildChildrenNodes()  (Recursive depth-first)
                                         │
                                         ▼
                               domElementBuilder()
                                 ├── 1. createElement(tagName)
                                 ├── 2. applyTextContent & applyProperties
                                 ├── 3. applyAttributes & applyClassList
                                 ├── 4. applyEvents
                                 └── 5. appendChildren
                                         │
                                         ▼
                                  [ Live DOM Node ]
```

---

## 📖 Documentation Index

### 🌐 Live Web Documentation (GitHub Pages)
- 🚀 **[Live Interactive Docs Hub](https://keshavsoft.github.io/json-to-dom/)** — Central portal with visual cards, quick starts, and guide navigation.
- 📝 **[Form Alignment Styles Gallery](https://keshavsoft.github.io/json-to-dom/samples/forms/)** — Focused label & input alignment patterns (Label Above, Label Left, Right-Aligned Label, Joined Addon Box).
- 💡 **[Component Samples Directory](https://keshavsoft.github.io/json-to-dom/samples/)** — Categorized samples for Forms, Cards, Data Tables, Interactive State, and Dashboards.
- 🏗️ **[Architecture & Pipeline Deep Dive](https://keshavsoft.github.io/json-to-dom/architecture-and-pipeline.html)** — Interactive Mermaid.js execution diagram and runtime flow.
- 📋 **[JSON Specification Schema Guide](https://keshavsoft.github.io/json-to-dom/spec-schema-and-guide.html)** — Full reference for `tagName`, `attributes`, `properties`, and `events`.
- ⚡ **[Live V3 Engine Demo](https://keshavsoft.github.io/json-to-dom/demo.html)** — Real-world interactive rendering running live in the browser.

---

### 📂 Repository Guides (HTML & Source)
1. **HTML Tag & Global Attribute Guides (W3C Grammar & Element Guides)**:
   - [Live Tag Guides](https://keshavsoft.github.io/json-to-dom/tags/html/) ([source](docs/tags/html/index.html))
   - [Tag-Specific Grammar Dictionary (tags.json)](https://keshavsoft.github.io/json-to-dom/tags/tags.json) ([source](docs/tags/tags.json))
   - [Global Allowed Attributes (globalAllowedAttributes.json)](https://keshavsoft.github.io/json-to-dom/tags/globalAllowedAttributes.json) ([source](docs/tags/globalAllowedAttributes.json)) — *Standard W3C global attributes (`style`, `title`, `hidden`, `tabindex`, `role`, `data-*`, `aria-*`) valid universally on all elements without tag-by-tag repetition.*
2. **Two-Tier Attribute Validation Architecture (v8)**:
   - **Tier 1 (Global)**: Attributes matching `globalAllowedAttributes.json` (or `data-*` / `aria-*` prefixes) are unconditionally accepted on all tags.
   - **Tier 2 (Tag-Specific)**: Tag-scoped attributes (e.g., `colspan` on `<th>`/`<td>`, `type` on `<input>`) are validated against `tags.json`.
3. **Architecture & Pipeline**:
   - [Live Architecture Guide](https://keshavsoft.github.io/json-to-dom/architecture-and-pipeline.html) ([source file](docs/architecture-and-pipeline.html))
4. **JSON Specification Schema & Authoring**:
   - [Live Spec Schema Guide](https://keshavsoft.github.io/json-to-dom/spec-schema-and-guide.html) ([source file](docs/spec-schema-and-guide.html))
5. **Form Alignment Styles**:
   - [Live Forms Gallery](https://keshavsoft.github.io/json-to-dom/samples/forms/) ([source folder](docs/samples/forms/))
6. **Interactive Samples Suite**:
   - [Live Samples Hub](https://keshavsoft.github.io/json-to-dom/samples/) ([source folder](docs/samples/))
7. **Architectural Blueprint**:
   - [DETAILS.md](DETAILS.md) — Comprehensive design document for transformation pipelines.

---

## 📜 License

ISC © [KeshavSoft](https://github.com/keshavsoft)

