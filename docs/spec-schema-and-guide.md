# JSON Specification Schema & Authoring Guide

This guide describes how to author declarative JSON specifications to generate DOM trees using the `json-to-dom` engine.

---

## 1. Specification Node Schema

A specification node is a plain JavaScript object describing an HTML element.

### Complete Schema Definition

```typescript
interface ElementSpec {
    // 1. Tag name of the element (Required)
    tagName: string;

    // 2. Direct textual content (Optional)
    textContent?: string;

    // 3. HTML attributes set via setAttribute / className (Optional)
    attributes?: Record<string, string | number | boolean>;

    // 4. Direct DOM properties assigned via Object.assign (Optional)
    properties?: Record<string, any>;

    // 5. Space-delimited string of classes added via classList (Optional)
    classList?: string;

    // 6. Event listeners registered via addEventListener (Optional)
    events?: Record<string, (event: Event) => void>;

    // 7. Child specification nodes or existing DOM nodes (Optional)
    children?: Array<ElementSpec | Node>;
}
```

---

## 2. Property Details & Behavior

### 2.1 `tagName` (Required)
- **Type**: `string`
- **Example**: `"div"`, `"table"`, `"thead"`, `"tr"`, `"th"`, `"button"`, `"input"`
- **Behavior**: Passed directly to `document.createElement(tagName)`. If omitted or falsy, the engine returns `null`.

### 2.2 `textContent` (Optional)
- **Type**: `string`
- **Example**: `"Stock Item Name"`, `"Submit"`
- **Behavior**: Sets `element.textContent`. Safely escapes any HTML markup.

### 2.3 `attributes` (Optional)
- **Type**: `Record<string, string | number | boolean>`
- **Example**:
  ```json
  {
      "id": "search-input",
      "type": "text",
      "placeholder": "Search items...",
      "class": "w-full border rounded px-3 py-2"
  }
  ```
- **Behavior**:
  - If the key is `"class"`, the engine sets `element.className = value`.
  - All other keys are assigned via `element.setAttribute(key, value)`.

### 2.4 `properties` (Optional)
- **Type**: `Record<string, any>`
- **Example**:
  ```javascript
  {
      value: "Initial text",
      disabled: false,
      checked: true
  }
  ```
- **Behavior**: Assigned directly to the DOM element instance via `Object.assign(element, properties)`. Useful for interactive form element states where HTML attributes and live DOM properties diverge.

### 2.5 `events` (Optional)
- **Type**: `Record<string, (event: Event) => void>`
- **Example**:
  ```javascript
  {
      click: (event) => console.log("Clicked!"),
      input: (event) => console.log("Input value:", event.target.value)
  }
  ```
- **Behavior**: Loops over every entry and invokes `element.addEventListener(eventName, handler)`.
- *Note*: Because functions cannot be serialized in standard `.json` files, event bindings are added when authoring specifications in `.js` modules, or attached via transformation pipelines.

### 2.6 `children` (Optional)
- **Type**: `Array<ElementSpec | Node>`
- **Behavior**: Each child in the array is recursively passed to `buildSpecElement`.
  - Nested spec objects are turned into DOM elements.
  - Pre-existing DOM `Node` instances are returned as-is (enabling hybrid composition).
  - Null or undefined values are automatically filtered out.
  - The resulting DOM nodes are appended via `element.appendChild(child)`.

---

## 3. Supported Input Shapes

The top-level input passed to `buildSpecElement({ inSpec })` supports multiple formats:

### A. Single Root Element
Returns a single `HTMLElement`:
```json
{
    "tagName": "div",
    "textContent": "Single container"
}
```

### B. Array of Elements (Fragments / Siblings)
Returns an `Array<HTMLElement>`:
```json
[
    { "tagName": "label", "textContent": "Username" },
    { "tagName": "input", "attributes": { "type": "text" } }
]
```

### C. Hybrid Array with Native DOM Nodes
You can mix JSON specifications with already-instantiated DOM nodes:
```javascript
const customCanvas = document.createElement("canvas");

const spec = {
    tagName: "div",
    children: [
        { tagName: "h2", textContent: "Chart Preview" },
        customCanvas // Direct DOM Node
    ]
};
```

---

## 4. Real-World Specification Examples

### Example 1: Search Form Input Group

```json
{
    "tagName": "div",
    "attributes": {
        "class": "flex flex-col space-y-1 mb-4 max-w-xs"
    },
    "children": [
        {
            "tagName": "label",
            "attributes": {
                "for": "tableSearchInput",
                "class": "text-sm font-medium text-gray-700 capitalize"
            },
            "textContent": "Search"
        },
        {
            "tagName": "input",
            "attributes": {
                "type": "text",
                "id": "tableSearchInput",
                "name": "search",
                "placeholder": "Search items...",
                "class": "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            }
        }
    ]
}
```

### Example 2: Data Table with Header & Rows

```json
{
    "tagName": "table",
    "attributes": {
        "class": "min-w-full divide-y divide-gray-200 border"
    },
    "children": [
        {
            "tagName": "thead",
            "attributes": { "class": "bg-gray-100" },
            "children": [
                {
                    "tagName": "tr",
                    "children": [
                        { "tagName": "th", "attributes": { "class": "px-4 py-2 text-left font-semibold" }, "textContent": "Voucher Type" },
                        { "tagName": "th", "attributes": { "class": "px-4 py-2 text-left font-semibold" }, "textContent": "Item Name" },
                        { "tagName": "th", "attributes": { "class": "px-4 py-2 text-left font-semibold" }, "textContent": "Amount" }
                    ]
                }
            ]
        },
        {
            "tagName": "tbody",
            "attributes": { "class": "bg-white divide-y divide-gray-100" },
            "children": [
                {
                    "tagName": "tr",
                    "children": [
                        { "tagName": "td", "attributes": { "class": "px-4 py-2" }, "textContent": "Sales/CA" },
                        { "tagName": "td", "attributes": { "class": "px-4 py-2 font-medium" }, "textContent": "Shading Net Kgs" },
                        { "tagName": "td", "attributes": { "class": "px-4 py-2 text-right" }, "textContent": "1000.00" }
                    ]
                }
            ]
        }
    ]
}
```

### Example 3: Interactive Button with Event Listener

```javascript
import { buildSpecElement } from "./src/v2/build/buildSpecElement.js";

const buttonSpec = {
    tagName: "button",
    textContent: "Export to CSV",
    attributes: {
        type: "button",
        class: "px-4 py-2 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700 active:scale-95 transition"
    },
    events: {
        click: (event) => {
            console.log("Export triggered:", event);
        }
    }
};

const domButton = buildSpecElement({ inSpec: buttonSpec });
document.body.appendChild(domButton);
```

---

## 5. Integration Recipes

### Rendering to a Specific DOM Container

```javascript
import { buildSpecElement } from "./src/v2/build/buildSpecElement.js";
import myJsonSpec from "./mySpec.json" with { type: "json" };

export const renderToContainer = ({ inContainerId = "app", inSpec = myJsonSpec }) => {
    const localContainerId = inContainerId;
    const localSpec = inSpec;

    const container = document.getElementById(localContainerId);
    if (!container) return;

    // Clear previous contents
    container.innerHTML = "";

    const domResult = buildSpecElement({ inSpec: localSpec });

    if (Array.isArray(domResult)) {
        container.append(...domResult);
    } else if (domResult) {
        container.appendChild(domResult);
    }
};
```

---

## 6. Best Practices & Tips

1. **Attributes vs Properties**:
   - Use `attributes` for HTML IDs, classes, data attributes, ARIA accessibility attributes, and standard layout tags.
   - Use `properties` when syncing live state such as `checked`, `value`, or element references.
2. **Class Names**:
   - You can define classes inside `attributes: { class: "..." }` or via `applyClassList` options.
3. **Falsy Children are Safe**:
   - Dynamic templates can use conditional inclusion (e.g. `isLoggedIn && userBadgeSpec`). Any falsy values (`false`, `null`, `undefined`) are automatically ignored during recursive rendering.
