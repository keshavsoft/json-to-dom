# json-to-dom

A declarative, zero-dependency JSON-to-DOM compiler for turning serializable specifications into live browser DOM element trees.

---

## 📖 The 3-Chapter Story Architecture (`v28`)

Starting in **`v28`**, `json-to-dom` is structured into **3 narrative chapters** that tell the complete story of a specification becoming living DOM:

```
src/v28/
├── index.js                           # Master Builder Entry Point (Story Orchestrator)
│
├── chapters/
│   ├── chapter1_inspection/           # Chapter 1: The Inspector & Standards
│   │   ├── standards/                 # W3C HTML tags & allowed attributes reference data
│   │   ├── validate/                  # Spec grammar & void tag validator (v1 & v2)
│   │   └── index.js
│   │
│   ├── chapter2_construction/         # Chapter 2: The Construction Line
│   │   ├── orchestration/             # Input normalization & global registration
│   │   ├── buildSpec/                 # Single element vs Spec array dispatcher
│   │   ├── elementBuilder/            # ⭐ 100% Preserved 0 to 5 Assembly Steps:
│   │   │   ├── 0.createElement.js     # Native element instantiation
│   │   │   ├── 1.applyTextContent.js   # textContent & innerHTML injection
│   │   │   ├── 2.applyProperties.js    # Direct DOM properties
│   │   │   ├── 3.applyAttributes.js    # HTML attributes & datasets
│   │   │   ├── 4.applyClassList.js     # CSS classList tokens
│   │   │   ├── 5.appendChildren.js     # Recursive child node attachment
│   │   │   └── index.js
│   │   └── index.js
│   │
│   └── chapter3_activation/           # Chapter 3: Activation & Interactivity
│       ├── listeners/                 # Versioned event delegation suites (v1 & v2)
│       ├── mountToContainer.js        # Direct container mounting by HTML ID
│       └── index.js                   # formOperations (extractFormValues, resetForm)
```

---

## Quick Start

```bash
# Instant scaffolding via zero-dependency CLI (always copies src's highest version)
npx json-to-dom

# Or run tests and explore locally
npm install
npm test
```

- **Demo**: https://keshavsoft.github.io/json-to-dom/
- **Playground**: https://keshavsoft.github.io/json-to-dom/docs/demo.html
- **Repo**: https://github.com/keshavsoft/json-to-dom

---

## Clean Usage (`v28`)

### 1. Build Native DOM Elements
```javascript
import { buildSpecElement } from "./src/v28/index.js";

const cardSpec = {
  tagName: "div",
  classList: "card shadow-sm p-4",
  children: [
    { tagName: "h5", textContent: "User Account" },
    { tagName: "input", attributes: { type: "text", placeholder: "Enter username", name: "username" } },
    { tagName: "button", textContent: "Save", classList: "btn btn-primary mt-3", attributes: { "data-action": "save" } }
  ]
};

// Returns native HTMLDivElement
const element = buildSpecElement({ spec: cardSpec });
document.getElementById("app").appendChild(element);
```

### 2. Render & Mount Directly to a Container (`specToDom`)
```javascript
import { specToDom } from "./src/v28/index.js";

// Directly mounts into document.getElementById("app")
specToDom({
  spec: cardSpec,
  targetHtmlId: "app"
});
```

### 3. Dual Output: Convert to HTML String (`specToHtml`)
```javascript
import { specToHtml } from "./src/v28/index.js";

const htmlString = specToHtml(cardSpec);
console.log(htmlString);
// <div class="card shadow-sm p-4"><h5>User Account</h5>...</div>
```

### 4. Interactive Action Delegation (`bindActions`)
```javascript
import { bindActions } from "./src/v28/index.js";

bindActions({
  container: document.getElementById("app"),
  actions: {
    save: ({ values, form }) => {
      console.log("Form saved with values:", values);
    },
    cancel: ({ reset }) => {
      reset();
    }
  }
});
```

---

## Documentation

- Overview: [docs/pages/overview.html](docs/pages/overview.html)
- Why this repo exists: [docs/pages/why.html](docs/pages/why.html)
- How it works: [docs/pages/how-it-works.html](docs/pages/how-it-works.html)
- Architecture: [docs/pages/architecture.html](docs/pages/architecture.html)
- Version strategy: [docs/pages/versions.html](docs/pages/versions.html)
- Detailed Technical Notes: [DETAILS.md](DETAILS.md)
