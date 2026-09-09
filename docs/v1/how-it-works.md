# How it works

The compilation flow from JSON to DOM follows a clean, deterministic pipeline.

## 1. Define the JSON Specification

Each UI element is described as a plain JavaScript or JSON object:

```json
{
  "tagName": "button",
  "textContent": "Submit Order",
  "classList": "btn btn-primary px-4",
  "attributes": {
    "type": "button",
    "id": "submit-btn",
    "data-action": "save"
  },
  "events": {
    "click": "(e) => handleSave(e)"
  }
}
```

## 2. Orchestration & Normalization (v11)

The top-level orchestrator in `src/v11/index.js` delegates to `1.normalizeInput.js`. It standardizes input arguments into a predictable structure:

- `spec`: The raw or extracted element specification.
- `applyEvents`: A boolean or configuration object (`{ internal: boolean, declared: boolean }`).
- `showLog`: Enables diagnostic compiler warnings.

## 3. Grammar Validation

Before creating elements, `json-to-dom` checks the spec against W3C definitions:

- **Tags**: Checked against `docs/tags/tags.json` (`isTagValid.js`). Unrecognized tags are discarded with a warning.
- **Attributes**: Checked against `globalAllowedAttributes.json` and tag-specific allowed attributes (`filterAttributes.js`).
- **Void Elements**: Children are prohibited on void tags (e.g. `input`).

## 4. Element Construction (The 7-Step Builder)

`domElementBuilder` executes 7 dedicated, numbered steps in `src/v11/elementBuilder/`:

- `0.createElement.js`: Instantiates the native browser element.
- `1.applyTextContent.js`: Sets text content if permitted by `tagDef.allowsTextContent`.
- `2.applyProperties.js`: Assigns native element properties (e.g. `value`, `checked`).
- `3.applyAttributes.js`: Applies filtered, permitted HTML attributes.
- `4.applyClassList.js`: Adds classes from a string (`"btn btn-primary"`) or array (`["btn", "btn-primary"]`).
- `5.appendChildren.js`: Recursively compiles and appends child nodes.
- `6.applyEvents.js`: Delegates to the optional event subsystem.

## 5. Modular Event Hooking (The 3 Chapters)

When event hooking is active, `src/v11/events/` executes three distinct chapters:

1. **Chapter 1 (Validation)**: `isEventAllowed.js` verifies the event is permitted on the tag.
2. **Chapter 2 (Internal Hooks)**: `attachInternalEvents.js` wires built-in interactive control hooks (such as `<button>` row-data extraction setting `event.output`).
3. **Chapter 3 (Declared Events)**: `attachDeclaredEvents.js` attaches user-defined callbacks from `spec.events`.

### How to Stop Event Hooking

- **Stop All Events**: `buildSpecElement({ inSpec, inApplyEvents: false })`
- **Stop Internal Hooks Only**: `buildSpecElement({ inSpec, inAttachInternal: false })`
- **Stop Declared Events Only**: `buildSpecElement({ inSpec, inApplyEvents: { declared: false } })`
- **Stop on Specific Element**: In `spec.json`: `{ "tagName": "button", "attachInternal": false }`

### Transparent Runtime Inspection

Every element tracks its hooked events directly on the DOM node:
```javascript
console.log(element.__ksEvents);
// { internal: ["click"], declared: ["click"] }
```

## 6. Mounting to the Document

The compiled native DOM node (or `DocumentFragment` for spec arrays) is returned directly, ready to be mounted via standard DOM APIs:

```javascript
document.getElementById("app").appendChild(domElement);
```
