# Table v11 Architecture & Theme Contract

## 1. Structural Mirroring Contract (GodSpec vs Theme Specs)
- `tableGodSpec.json` defines the master HTML element tree for the `<table>` component (`table` -> `thead` -> `tr` -> `th` and `tbody`).
- **CRITICAL RULE:** All theme JSON files in `webComponents/v6/core/controls/table/v11/themes/` (`light.json`, `dark.json`, `extra-dark.json`, `extra-light.json`, `medium.json`) **MUST strictly mirror the exact node tree hierarchy of `tableGodSpec.json`**.
- Theme files specify only the Tailwind `class` attribute overrides for styling corresponding nodes at the same tree depth.
- If `tableGodSpec.json` is modified or structural nodes are refactored/moved, all theme JSON files in `./themes/` MUST be updated to maintain identical tree depth and node order.

## 2. Layout Shell vs Table Decoupling
- `tableLayoutSpec.json` defines the outer container shell (`div.table-wrapper`).
- `renderSkeleton` constructs the outer layout DOM element.
- `createTableTask` (in `renderPipeline/tasks/tableTask.js`) transforms `tableGodSpec.json` with theme specs and appends `<table>` as a pluggable pipeline task.
