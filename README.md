# json-to-dom

A declarative, zero-dependency JSON-to-DOM compiler for turning serializable specifications into live browser DOM element trees.

## Start here

- Overview: [docs/overview.html](docs/overview.html)
- Why this repo exists: [docs/why.html](docs/why.html)
- How it works: [docs/how-it-works.html](docs/how-it-works.html)
- Architecture: [docs/architecture.html](docs/architecture.html)
- Tasks / todo: [docs/tasks.html](docs/tasks.html)

## Quick start

```bash
# Instant scaffolding via zero-dependency CLI (copies latest v11 engine)
npx json-to-dom

# Or run tests and explore locally
npm install
npm test
```

Then open the local demo or visit:

- Demo: https://keshavsoft.github.io/json-to-dom/
- Playground: https://keshavsoft.github.io/json-to-dom/docs/demo.html
- Repo: https://github.com/keshavsoft/json-to-dom

## Minimal usage

```javascript
import { buildSpecElement } from "./src/v11/index.js";

// 1. Define a declarative UI specification
const cardSpec = {
  tagName: "div",
  classList: "card shadow-sm p-4",
  children: [
    { tagName: "label", textContent: "User Account" },
    { tagName: "input", attributes: { type: "text", placeholder: "Enter username" } },
    {
      tagName: "button",
      textContent: "Save",
      classList: "btn btn-primary mt-3",
      events: {
        click: (event) => console.log("Saved!", event.output)
      }
    }
  ]
};

// 2. Compile directly into a native browser DOM element
const domElement = buildSpecElement({ inSpec: cardSpec });
document.getElementById("app").appendChild(domElement);
```

### Event Hooking Control

Event hooking is completely decoupled and optional:

```javascript
// Pure DOM with zero event listeners
const staticDom = buildSpecElement({ inSpec: cardSpec, inApplyEvents: false });

// Keep declared spec events, but stop internal component hooks
const customDom = buildSpecElement({ inSpec: cardSpec, inAttachInternal: false });

// Inspect hooked events at runtime
console.log(domElement.__ksEvents);
```

## Scope

This repo is intentionally narrow. It compiles declarative JSON specifications into live browser DOM trees with W3C grammar validation and optional, decoupled event orchestration, but it is not a full application framework or a general-purpose Virtual DOM diffing system.

For a deeper explanation, read the linked docs in the `docs/` folder.
