# Version Strategy & src Evolution

This document explains why `json-to-dom` is structured with versioned folders in `src/`, how the **highest version** in `src/` is determined, and how developers wire and consume it.

---

## 1. Why `src/` is Versioned (`v1` to `v11` and beyond)

Instead of overwriting code in place on every refactor, `json-to-dom` maintains versioned engine folders (`src/v1/`, `src/v2/`, ... `src/v11/`).

### Why do this?
1. **Architectural Permanence**: Each version represents a specific milestone in the compiler's design. You can inspect how the library evolved from early DOM traversal experiments (`v1-v7`) to two-tier attribute filtering (`v8`), strict event guarding (`v9`), modular event stories (`v10`), and pure orchestration (`v11`).
2. **Zero Breaking Changes for Legacy Callers**: Existing samples, legacy apps, and previous benchmark suites can pin directly to a specific version (e.g. `src/v9/index.js`) without risking unexpected regressions.
3. **Safe Innovation**: Major architectural overhauls (such as decoupling event handling or refactoring orchestration) happen in a new version folder, ensuring complete testability before becoming the default.

---

## 2. Understanding "src's Highest Version"

At any given time, the active version of the library is **src's highest version** (e.g. `v11`).

### How `npx json-to-dom` Finds the Highest Version Dynamically
The zero-dependency CLI executable ([bin/cli.js](file:///d:/KeshavSoftRepos/sep/9/json-to-dom/bin/cli.js)) does **not** hardcode a version number. Instead, it dynamically discovers the highest version at runtime:

```javascript
// Scans src/, matches v{number}, and sorts descending
const versionFolders = readdirSync(srcDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^v\d+$/.test(entry.name))
    .map(entry => ({ name: entry.name, n: Number(entry.name.slice(1)) }))
    .sort((a, b) => b.n - a.n);

const highestVersion = versionFolders[0].name; // e.g. "v11"
```

When someone runs:
```bash
npx json-to-dom ./my-components
```
It automatically copies the highest version (`v11`) to `./my-components`. When `v12` is added tomorrow, the CLI will copy `v12` automatically with zero changes to the CLI script!

---

## 3. Developer Guide: How to Wire `index.js` for the Highest Version

### How the Root `index.js` Works
The repository root contains a proxy file ([index.js](file:///d:/KeshavSoftRepos/sep/9/json-to-dom/index.js)). Its sole responsibility is to re-export **src's highest version**:

```javascript
// d:/KeshavSoftRepos/sep/9/json-to-dom/index.js
export * from "./src/v11/index.js";
export { default } from "./src/v11/index.js";
```

### Where to Put the Highest Version in Configuration:
1. **Root `index.js`**: Point the exports to `./src/v{HIGHEST}/index.js`.
2. **`package.json`**:
   - `"module": "./src/v{HIGHEST}/index.js"`
   - `"test"`: Include `test/v{HIGHEST}.unit.test.js`.

### How Consumers Should Import (Never Hardcode Versions in Apps!)
Application code consuming `json-to-dom` should **never** hardcode version paths like `./src/v11/index.js`. Instead, use either:

```javascript
// Option A: When installed via npm (always loads src's highest version)
import { buildSpecElement } from "json-to-dom";

// Option B: When using local repository root proxy
import { buildSpecElement } from "./index.js";

// Option C: When scaffolded into a project via npx json-to-dom
import { buildSpecElement } from "./json-to-dom/index.js";
```

This ensures application code remains clean and future-proof. When the library upgrades to a higher version, user code does not need a single line changed.

---

## 4. How to Create a New Version (e.g. `v12`)

When introducing a new architectural milestone:
1. Clone the current highest version:
   ```bash
   cp -r src/v11 src/v12
   ```
2. Implement your changes inside `src/v12/`.
3. Update root `index.js`:
   ```javascript
   export * from "./src/v12/index.js";
   export { default } from "./src/v12/index.js";
   ```
4. Update `package.json` `"module"` to `"./src/v12/index.js"`.
5. Add `test/v12.unit.test.js`.
6. Done! The CLI (`npx json-to-dom`) will instantly recognize `v12` as the new highest version automatically.
