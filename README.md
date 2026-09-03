# JSON to DOM (`dom-builder-from-json`)

> **Declarative, zero-dependency JSON-to-DOM creation engine for modern web interfaces.**

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
│   ├── index.html                      # Interactive documentation portal
│   ├── architecture-and-pipeline.md    # Deep dive: Markdown version
│   ├── architecture-and-pipeline.html  # Deep dive: Web/HTML version (with Mermaid diagrams)
│   ├── spec-schema-and-guide.md        # Spec reference: Markdown version
│   └── spec-schema-and-guide.html      # Spec reference: Web/HTML version
├── package.json
└── src/
    ├── v1/                             # Initial implementation baseline
    └── v2/                             # Current modular engine
        ├── index.html                  # Browser entry point (Tailwind CSS container)
        ├── index.js                    # Demo runner importing input.json & building DOM
        ├── input.json                  # Real-world declarative spec (Search bar + Data Table)
        └── build/
            ├── buildSpecElement.js     # Primary recursive dispatcher entry point
            ├── buildSpec/              # Validation, array unwrapping & recursive traversal
            └── elementBuilder/         # Low-level DOM construction & attribute/event application
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

You can read the guides in Markdown or open their styled HTML versions directly in your browser:

1. **Architecture & Pipeline Deep Dive**:
   - [Markdown Version](docs/architecture-and-pipeline.md)
   - [HTML Web Version](docs/architecture-and-pipeline.html) — includes interactive Mermaid.js diagram.
2. **JSON Specification Schema & Authoring Guide**:
   - [Markdown Version](docs/spec-schema-and-guide.md)
   - [HTML Web Version](docs/spec-schema-and-guide.html)
3. **[Interactive Docs Hub](docs/index.html)**:
   - Central portal with card navigation and quick-start snippets.
4. **[DETAILS.md](DETAILS.md)**:
   - Complete architectural blueprint for transformation pipelines and theme tasks.

---

## 📜 License

ISC © [KeshavSoft](https://github.com/keshavsoft)
