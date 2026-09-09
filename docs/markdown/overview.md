# Overview

`json-to-dom` is a declarative, zero-dependency compiler for turning JSON specifications into live browser DOM element trees.

Instead of writing imperative `document.createElement`, setting attributes manually, and wiring event listeners by hand, the UI structure is defined as a serializable JSON specification. The engine validates the spec against W3C grammar and compiles it into pure DOM nodes.

## What it is

This project is a lightweight, pure JavaScript engine for declarative DOM construction. It maintains a strict architectural boundary between the **JSON Specification World** (serializable, portable data) and the **DOM World** (browser element instances and mutations).

## What it is not

It is not:

- a Virtual DOM diffing or reconciliation engine (like React)
- a full application or state management framework
- a CSS-in-JS or styling framework
- a backend or server-side templating engine

## Typical use cases

- metadata-driven UI generators and admin panels
- config-driven form and table renderers (e.g. `json-to-dom-form`)
- dynamic component rendering from backend JSON responses
- cross-platform component definitions stored in databases or files
- micro-frontends requiring zero framework dependencies

## Core idea

The library separates three core concepts:

1. **The Specification**: Plain, portable JSON objects describing tag, text, properties, attributes, and children.
2. **The Guardian**: Schema-backed validation against allowed HTML tags, attributes, and events.
3. **The Orchestrator (v11)**: A sleek, 3-step pipeline (`normalizeInput` -> `dispatchSpec` -> `registerGlobal`) that constructs DOM nodes with optional, decoupled event hooking.
