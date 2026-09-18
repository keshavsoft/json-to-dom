# @keshavsoft/json-to-dom

A declarative, zero-dependency JSON-to-DOM compiler for turning serializable specifications into live browser DOM element trees.

---

## Installation

```bash
npm install @keshavsoft/json-to-dom
```

Or scaffold the engine directly into your project via CLI:

```bash
npx @keshavsoft/json-to-dom [destination-directory]
```

---

## 📖 Engine Architecture (`v39`)

The `v39` engine provides a high-performance, modular pipeline that transforms JSON element specifications into real DOM nodes:

```
src/v39/
├── index.js                           # Master entry point (specToDom, buildSpecElement)
├── meta.js                            # Engine metadata (v39.0)
├── registerGlobal.js                  # Global browser registration (window.ks['json-to-dom'])
└── chapters/
    ├── buildSpec/                     # Single element vs array dispatcher & children builder
    │   ├── buildChildrenNodes.js
    │   ├── buildElementWithChildren.js
    │   ├── buildSingleElement.js
    │   ├── buildSpecArray.js
    │   ├── elementBuilder/            # 0 to 5 Assembly Line Steps:
    │   │   ├── 0.createElement.js     # Native DOM instantiation
    │   │   ├── 1.applyTextContent.js   # textContent injection
    │   │   ├── 2.applyProperties.js    # Direct DOM properties
    │   │   ├── 3.applyAttributes.js    # Attributes & dataset
    │   │   ├── 4.applyClassList.js     # CSS class tokens
    │   │   ├── 5.appendChildren.js     # Recursive child attachment
    │   │   └── index.js
    │   ├── guards.js                  # Type guards & validation
    │   └── index.js
    └── chapter3_activation/
        ├── mountToContainer.js        # Direct container mounting by HTML ID
        └── index.js
```

---

## Usage

### 1. Build Native DOM Elements
```javascript
import { buildSpecElement } from "json-to-dom";

const cardSpec = {
  tagName: "div",
  classList: "card shadow-sm p-4",
  children: [
    { tagName: "h5", textContent: "User Account" },
    { 
      tagName: "input", 
      attributes: { type: "text", placeholder: "Enter username", name: "username" } 
    },
    { 
      tagName: "button", 
      textContent: "Save", 
      classList: "btn btn-primary mt-3", 
      attributes: { "data-action": "save", type: "button" } 
    }
  ]
};

// Returns native HTMLDivElement
const element = buildSpecElement({ spec: cardSpec });
document.getElementById("app").appendChild(element);
```

### 2. Render & Mount Directly to a Container (`specToDom`)
```javascript
import { specToDom } from "json-to-dom";

// Mounts directly into document.getElementById("app")
specToDom({
  spec: cardSpec,
  domIdToPushTo: "app"
});
```

### 3. Build Arrays of Specs (Tables, Lists)
```javascript
import { buildSpecElement } from "json-to-dom";

const rowsSpec = [
  { tagName: "tr", children: [{ tagName: "td", textContent: "Row 1" }] },
  { tagName: "tr", children: [{ tagName: "td", textContent: "Row 2" }] }
];

// Mounts all rows directly into tbody
buildSpecElement({
  spec: rowsSpec,
  domIdToPushTo: "tbody"
});
```

### 4. Parameter Naming Convention Support
Functions support both standard properties and our `in`-prefixed convention:
```javascript
import { buildSpecElement } from "json-to-dom";

const element = buildSpecElement({
  inSpec: { tagName: "div", textContent: "Hello World" },
  inDomIdToPushTo: "container"
});
```

---

## Development & Testing

```bash
# Run test suite
npm test

# Build production bundle
npm run build
```

---

## License

[ISC](LICENSE) © [KeshavSoft](https://github.com/keshavsoft)
