# Architecture

The `json-to-dom` repository is organized around a strictly layered compiler pipeline.

## Top-level structure

- `src/` — Library source code
- `src/v1` to `src/v11` — Versioned architectural generations
- `docs/` — Live documentation portal, interactive demos, and samples
- `bin/cli.js` — Zero-dependency scaffolding CLI executable (`npx json-to-dom`)

## Main runtime flow

```text
buildSpecElement(inArgs)
  │
  ├─► orchestration/1.normalizeInput.js  ──► Extracts { spec, applyEvents, showLog }
  │
  └─► orchestration/2.dispatchSpec.js    ──► Routes spec by shape:
        │
        ├─► null / undefined             ──► returns null
        ├─► Node instance                ──► passthrough
        ├─► Array of specs               ──► buildSpecArray() -> DocumentFragment
        │
        └─► Single spec object           ──► buildSingleElement()
                                               │
                                               ├─► buildChildrenNodes() (recursive)
                                               │
                                               └─► elementBuilder/ (steps 0 to 6):
                                                     0. createElement.js
                                                     1. applyTextContent.js
                                                     2. applyProperties.js
                                                     3. applyAttributes.js
                                                     4. applyClassList.js
                                                     5. appendChildren.js
                                                     6. applyEvents.js
                                                           │
                                                           ▼
                                                     events/ (chapters 1 to 3):
                                                       1.validate/isEventAllowed.js
                                                       2.internal/attachInternalEvents.js
                                                       3.declared/attachDeclaredEvents.js
```

## Important components

### 1. The v11 Master Orchestrator (`src/v11/index.js`)
A sleek, concise entry point (< 80 lines). It delegates input normalization, routes the spec to the build pipeline, and registers the global environment without polluting the core logic.

### 2. The Orchestration Pipeline (`src/v11/orchestration/`)
- `1.normalizeInput.js`: Standardizes raw specs and option objects (`inSpec`, `inApplyEvents`, `inAttachInternal`, `inShowLog`).
- `2.dispatchSpec.js`: Determines whether the spec is null, a DOM Node, an array fragment, or a single element.
- `3.registerGlobal.js`: Safely mounts the API to `globalThis.ks["json-to-dom"]`.

### 3. Element Builder (`src/v11/elementBuilder/`)
Seven focused, numbered step files (0 to 6) executing in strict sequence to construct and decorate native DOM elements.

### 4. Modular Event Story (`src/v11/events/`)
- `1.validate/`: Checks event allowances against W3C dictionary.
- `2.internal/`: Wires built-in component hooks (e.g. `<button>` click handling, row data extraction, and `event.output`).
- `3.declared/`: Validates and binds user callbacks from `spec.events`.
- `getHookedEvents.js`: Exposes runtime inspection of `element.__ksEvents`.

## Why the repo is split by version

The version folders show the evolution of the engine:
- `v1` to `v7`: Early experiments and proof-of-concepts.
- `v8`: Two-tier global and tag-specific attribute validation.
- `v9`: Strict event guarding and allowed-events dictionaries.
- `v10`: Decoupled, modular event story folder structure.
- `v11`: Sleek orchestration-only index, numbered pipeline steps, and granular event stopping/inspection.

Older versions remain in the repository for backwards compatibility, benchmarking, and historical reference. The root `index.js` and package exports always point to the latest version (`v11`).

## Design intent

- **Zero Dependencies**: Relies entirely on native browser Web APIs.
- **Strict Parameter Convention**: 100% adherence to `{ in... }` / `local...` variables.
- **Separation of Concerns**: Pure DOM construction is decoupled from event mechanics.
- **Predictable & Guarded**: Invalid tags, void child elements, and unpermitted attributes are caught before causing silent DOM bugs.
