# Why this repo exists

This repo exists because imperative DOM construction creates fragile, repetitive churn across web applications.

If your application receives data from an API, a form schema, or a metadata catalog, writing manual `document.createElement`, setting attributes, appending child nodes, and wiring event listeners repeatedly is error-prone and hard to maintain.

`json-to-dom` bridges this gap: let data describe the structure, and let a deterministic, zero-dependency compiler build the live DOM tree.

## The main problem it solves

Manual DOM building and raw HTML strings introduce severe pain points:

- **Repetitive Boilerplate**: Hundreds of lines of imperative DOM mutations for simple layouts.
- **Fragile Validation**: Browser DOM APIs fail silently or accept malformed attributes without warning.
- **Tightly Coupled Events**: Wiring event handlers inside element creation logic makes pure rendering impossible.
- **Framework Overhead**: Importing heavy Virtual DOM libraries (React, Vue) just to render data-driven DOM nodes adds unnecessary complexity and bundle weight.

`json-to-dom` solves this by keeping the specification strictly serializable (JSON) while guaranteeing clean, guarded native DOM compilation.

## The tradeoff

This engine compiles JSON to DOM cleanly and efficiently, but it does not attempt to be a reactive application framework. It does not provide virtual DOM diffing, reactive signals, or state management. It is intentionally narrow and focused on one task: compiling specifications into DOM elements.

## In one sentence

The repo exists to turn serializable JSON specifications into live browser DOM element trees with zero dependencies and built-in W3C grammar validation.
