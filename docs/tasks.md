# Tasks / todo

This project is intentionally small, focused, and zero-dependency. The roadmap and guardrails are clear:

## Current priorities

- Keep the core engine clean, minimal, and free of external dependencies.
- Keep documentation, README, and guides aligned with the active `v11` architecture.
- Preserve strict KeshavSoft `{ in... }` / `local...` parameter conventions across all functions.
- Keep event hooking transparent, granular, and easily inspectable via `getHookedEvents`.

## Useful follow-ups

- Expand tag definitions in `docs/tags/tags.json` for newer HTML5 tags (e.g. `<dialog>`, `<details>`, `<summary>`).
- Add performance benchmarks comparing imperative DOM construction against `json-to-dom` compilation.
- Expand interactive sample galleries for advanced data-table and form alignment patterns.
- Enhance CLI scaffolding options (`npx json-to-dom`) for project templates.

## Scope guardrails

If a change would:

- Add external npm runtime dependencies.
- Introduce a heavy Virtual DOM diffing or reconciliation engine.
- Add complex state management, routing, or full application framework logic.
- Break the strict boundary between serializable JSON data and DOM node creation.

Then it falls outside the project scope.

## Project intent

The repo must remain a fast, reliable, zero-dependency declarative compiler that turns JSON specifications into browser DOM element trees.
