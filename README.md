# JSON to DOM (`json-to-dom`)

> **Declarative, zero-dependency JSON-to-DOM compiler for high-performance web applications.**

[🌐 **Live Documentation**](https://keshavsoft.github.io/json-to-dom/) &bull; 
[📝 **Form Alignment Styles**](https://keshavsoft.github.io/json-to-dom/samples/forms/) &bull; 
[💡 **Component Gallery**](https://keshavsoft.github.io/json-to-dom/samples/) &bull; 
[⚡ **Interactive Playground**](https://keshavsoft.github.io/json-to-dom/demo.html) &bull; 
[🏗️ **Architecture Guide**](https://keshavsoft.github.io/json-to-dom/architecture-and-pipeline.html)

`json-to-dom` is a lightweight, pure JavaScript engine that converts declarative JSON specifications into live browser DOM element trees. It enforces a strict architectural boundary between the **JSON Specification World** (serializable, portable data) and the **DOM World** (browser element instances and mutations).

---

## 🌟 Key Highlights

- ⚡ **Zero Dependencies**: Pure native DOM APIs (`document.createElement`, `classList`, `setAttribute`, `addEventListener`, `createTextNode`).
- 📦 **Instant Project Scaffolding via NPX**: Copy the latest standalone engine directly into your app with `npx json-to-dom`.
- 🧩 **Modular v10 Architecture**: Pure core DOM element builder with decoupled, optional event handling.
- 📖 **Story-Structured Events (`src/v10/events/`)**: The event pipeline is partitioned into an intuitive narrative:
  1. `1.validate/` — Guarding permissions against `allowedEvents.json`.
  2. `2.internal/buttonClick/` — Internal component hooks (`data-closest-target`, `data-highlight`, and `event.output`).
  3. `3.declared/` — User-declared spec event listeners.
- 📐 **KeshavSoft Parameter Convention**: 100% adherence to `{ in... }` argument destructuring mapped directly to `local...` variables.
- 🔁 **Recursive & Fragment-Friendly**: Builds single nodes, nested trees, arrays of specs, or native DOM nodes seamlessly.

---

## 🚀 Quick Start

### 1. Copy the Engine with NPX (Recommended)

Run `npx json-to-dom` to automatically discover and copy the highest version (v10) directly into your project:

```bash
# Copy latest version (v10) to ./json-to-dom
npx json-to-dom

# Or specify a custom target directory
npx json-to-dom ./src/lib/json-to-dom

# View CLI options
npx json-to-dom --help
```

### 2. Basic Usage in JavaScript

```javascript
import { buildSpecElement, buildSpecElementWithEvents } from "json-to-dom";
// Or import directly from local path:
// import { buildSpecElement } from "./json-to-dom/index.js";

// 1. Pure DOM Building (Zero event overhead)
const cardSpec = {
    tagName: "div",
    classList: "card shadow-sm p-4",
    children: [
        { tagName: "label", textContent: "User Account" },
        { tagName: "input", attributes: { type: "text", placeholder: "Enter username" } }
    ]
};

const domNode = buildSpecElement({ inSpec: cardSpec });
document.getElementById("app").appendChild(domNode);

// 2. Interactive DOM Building with Events
const buttonSpec = {
    tagName: "button",
    textContent: "Submit Form",
    attributes: { type: "button", class: "btn btn-primary" },
    events: {
        click: (e) => alert("Saved!")
    }
};

const domButton = buildSpecElementWithEvents({ inSpec: buttonSpec });
document.getElementById("app").appendChild(domButton);
```

---

## 🏗️ Architecture & Engine Execution

```
[ Declarative JSON Spec ]
          │
          ▼
buildSpecElement({ inSpec, inApplyEvents })  ──► Validates spec type (Null, Node, Array, or Object)
          │
          ├─► [Array of Specs] ──► buildSpecArray() ──► maps items recursively
          │
          └─► [Single Spec]    ──► buildSingleElement()
                                          │
                                          ▼
                                 buildChildrenNodes()  (Recursive depth-first + text nodes)
                                          │
                                          ▼
                                 domElementBuilder()
                                   ├── 0. createElement(tagName)
                                   ├── 1. applyTextContent (guarded by tagDef.allowsTextContent)
                                   ├── 2. applyProperties (Object.assign)
                                   ├── 3. applyAttributes (filtered by global + tag-specific attributes)
                                   ├── 4. applyClassList (string or array)
                                   ├── 5. appendChildren (Element nodes & Text nodes)
                                   │
                                   ▼
                         [ Optional Event Story ]
                         (when inApplyEvents is enabled)
                                   ├── Chapter 1: isEventAllowed validation
                                   ├── Chapter 2: Internal button click interactions
                                   └── Chapter 3: Spec-declared event listeners
                                          │
                                          ▼
                                    [ Live DOM Node ]
```

---

## 📁 Repository Structure

```text
json-to-dom/
├── bin/
│   └── cli.js                          # npx CLI (copies highest engine version dynamically)
├── index.js                            # Root proxy entry exporting active v10 engine
├── package.json                        # Package configuration & test runner
├── README.md                           # Main project overview & quickstart (this file)
├── DETAILS.md                          # Comprehensive runtime architecture & pipeline concepts
├── docs/                               # Live Documentation Portal (GitHub Pages)
│   ├── index.html                      # Documentation landing portal
│   ├── architecture-and-pipeline.html  # Runtime architecture & compiler flow
│   ├── spec-schema-and-guide.html      # Specification schema & property guide
│   ├── demo.html                       # Live browser compiler playground
│   ├── tags/                           # W3C grammar specs & element dictionaries
│   │   ├── tags.json                   # Tag-specific grammar dictionary
│   │   ├── globalAllowedAttributes.json# Standard global attributes & wildcards
│   │   └── allowedEvents.json          # Permitted controls & allowed event types
│   └── samples/                        # Standalone sample gallery (forms, cards, tables)
└── src/
    ├── v8/                             # Two-tier global attribute resolution
    ├── v9/                             # Guarded event validation
    └── v10/                            # Latest Engine: Modular Optional Events & Story Architecture
        ├── buildSpec/                  # Traversal, single/array/children node building
        ├── elementBuilder/             # Pure native DOM construction (steps 0 to 5)
        ├── events/                     # Decoupled Event Story System
        │   ├── 1.validate/             # Chapter 1: isEventAllowed & isControlWithEvents
        │   ├── 2.internal/             # Chapter 2: Built-in component hooks & buttonClick
        │   │   └── buttonClick/        # getClosestTarget, applyHighlight, extractOutput
        │   ├── 3.declared/             # Chapter 3: User spec-declared event listeners
        │   └── index.js                # applyEvents coordinator
        ├── validate/                   # Attribute & spec validators
        └── index.js                    # v10 Master Entry Point (buildSpecElement, applyEvents)
```

---

## 🧪 Testing

The repository features comprehensive automated test suites covering all architectural generations:

```bash
# Run all unit tests (v7, v8, v9, and v10)
npm test

# Run only v10 unit tests
node --test test/v10.unit.test.js
```

---

## 📖 Documentation Index

- 🚀 **[Live Documentation Hub](https://keshavsoft.github.io/json-to-dom/)** — Central portal with visual cards and quick starts.
- 📝 **[Form Alignment Styles Gallery](https://keshavsoft.github.io/json-to-dom/samples/forms/)** — Focused label & input alignment patterns.
- 💡 **[Component Samples Directory](https://keshavsoft.github.io/json-to-dom/samples/)** — Categorized samples for Forms, Cards, Data Tables, and State.
- 🏗️ **[Architecture & Pipeline Guide](https://keshavsoft.github.io/json-to-dom/architecture-and-pipeline.html)** — Interactive execution diagrams and runtime flow.
- 📋 **[JSON Specification Schema Guide](https://keshavsoft.github.io/json-to-dom/spec-schema-and-guide.html)** — Reference for `tagName`, `attributes`, `classList`, `properties`, and `events`.
- ⚡ **[Live Engine Playground](https://keshavsoft.github.io/json-to-dom/demo.html)** — Real-world interactive rendering running live in the browser.

---

## 📜 License

ISC © [KeshavSoft](https://github.com/keshavsoft)
