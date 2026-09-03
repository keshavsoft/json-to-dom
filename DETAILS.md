# Detailed Architecture

**Back to [README.md](README.md)**

This document explains the internal architecture and the flow from a declarative JSON specification to the final DOM.

---

# 1. Complete Runtime Flow

The complete conceptual flow is:

~~~text
Application
    |
    | data + configuration
    v
Component Renderer
    |
    v
God JSON / Base Spec
    |
    v
Theme Resolution
    |
    v
Transformation Pipeline
    |
    +--> Theme Task
    +--> Header Task
    +--> Body Task
    +--> Footer Task
    +--> Serial Task
    +--> Custom Tasks
    |
    v
Resolved JSON Spec
    |
    v
buildSpecElement()
    |
    | recursive
    v
domElementBuilder()
    |
    v
DOM Tree
~~~

The most important boundary is:

~~~text
              JSON world
                  |
                  |
          buildSpecElement()
                  |
                  v
               DOM world
~~~

Everything before the recursive builder works with specifications.

The DOM is created only at the final stage.

---

# 2. God JSON

The God JSON is the initial UI blueprint.

It describes the complete structural tree.

Example:

~~~json
{
  "tagName": "div",
  "children": [
    {
      "tagName": "table",
      "children": [
        {
          "tagName": "thead"
        },
        {
          "tagName": "tbody"
        },
        {
          "tagName": "tfoot"
        }
      ]
    }
  ]
}
~~~

This is not HTML.

It is not a DOM tree.

It is a declarative description from which a DOM tree can eventually be produced.

The God Spec therefore answers:

> **What should exist?**

---

# 3. Theme Spec

The Theme Spec describes appearance separately.

For example:

~~~json
{
  "tagName": "table",
  "attributes": {
    "class": "bg-gray-900 text-gray-200"
  }
}
~~~

The separation is:

~~~text
God Spec
= structure

Theme Spec
= appearance
~~~

This means the same structural specification can potentially be rendered using different themes.

The DOM builder does not need to understand any theme name.

---

# 4. Theme Resolution

The theme resolver selects the appropriate theme.

Conceptually:

~~~text
inTheme
     |
     +--> theme object
     |
     +--> theme name
     |
     +--> default theme
~~~

For example:

~~~js
resolveThemeSpec({
    inTheme: "dark"
});
~~~

returns the corresponding theme specification.

A complete theme object can also be supplied directly.

This keeps theme selection separate from DOM creation.

---

# 5. Theme Transformation

The theme task delegates to:

~~~js
applyTheme({
    inSpec,
    inThemeSpec
});
~~~

The transformation walks the specification tree recursively.

Conceptually:

~~~text
God Spec Node
      +
Theme Spec Node
      |
      v
Merged Spec Node
~~~

The result is still JSON.

No DOM has been created.

This is important.

Theme application is a **specification transformation**, not a DOM operation.

---

# 6. Transformation Pipeline

The pipeline is a list of functions.

Conceptually:

~~~js
[
    themeTask,
    headerTask,
    bodyTask,
    footerTask,
    serialTask,
    customTask
]
~~~

The runner processes them sequentially.

~~~text
Spec
 |
 v
Task 1
 |
 v
Spec
 |
 v
Task 2
 |
 v
Spec
 |
 v
Task 3
 |
 v
Spec
~~~

The generic runner does not know what each task does.

Its responsibility is only:

> Pass the current specification to the next function.

---

# 7. `runPipeline`

The pipeline runner is intentionally small.

Its conceptual behavior is:

~~~js
pipeline.reduce(
    (currentSpec, task) => task({ inSpec: currentSpec }),
    inSpec
);
~~~

This is an important architectural boundary.

`runPipeline()` does not know:

- tables
- forms
- themes
- columns
- rows
- headers

It only knows how to execute transformation functions.

Therefore the same pipeline engine can be reused elsewhere.

---

# 8. `buildTablePipeline`

`buildTablePipeline()` assembles the table-specific tasks.

Conceptually:

~~~text
Theme
Header
Body
Footer
Serial
Custom Tasks
~~~

The important distinction is:

~~~text
buildTablePipeline()
        |
        | decides which tasks exist
        v
pipeline[]

runPipeline()
        |
        | executes them
        v
resolvedSpec
~~~

The pipeline builder assembles.

The pipeline runner executes.

They have different responsibilities.

---

# 9. Table Transformations

A table feature should ideally become a transformation task.

Examples:

~~~text
Header visibility
        -> Header Task

Body visibility
        -> Body Task

Footer visibility
        -> Footer Task

Serial column
        -> Serial Task

Theme
        -> Theme Task
~~~

This prevents the main table renderer from becoming a giant collection of conditions.

---

# 10. Why Tasks Are Useful

Suppose a future feature requires an options column.

Instead of modifying the entire DOM creation system:

~~~text
Options Column
      |
      v
Options Transformation
      |
      v
Modified Spec
      |
      v
DOM Builder
~~~

The generic DOM builder remains unchanged.

The table pipeline simply gains another transformation.

---

# 11. `renderSkeleton`

`renderSkeleton()` is the main skeleton-stage orchestrator.

Its conceptual responsibilities are:

1. Resolve theme.
2. Build pipeline.
3. Run pipeline.
4. Build DOM from resolved spec.

So:

~~~text
God Spec
   |
   v
Theme Resolution
   |
   v
Pipeline Construction
   |
   v
Pipeline Execution
   |
   v
Resolved Spec
   |
   v
buildSpecElement()
   |
   v
DOM
~~~

This is a very important architectural boundary.

---

# 12. Recursive `buildSpecElement`

`buildSpecElement()` is the bridge between JSON and DOM.

It recursively walks the specification.

Conceptually:

~~~text
buildSpecElement(spec)
        |
        +--> already a Node?
        |       |
        |       +--> return Node
        |
        +--> array?
        |       |
        |       +--> recursively build every item
        |
        +--> object?
                |
                +--> recursively build children
                |
                +--> create current element
~~~

For example:

~~~text
div
 ├── div
 │    ├── span
 │    └── input
 │
 └── table
      ├── thead
      │    └── tr
      │
      ├── tbody
      │
      └── tfoot
~~~

The recursive builder can construct this entire tree.

There is no table-specific recursion here.

That makes it reusable.

---

# 13. DOM Element Builder

After children have been converted into actual Nodes, the lower-level DOM builder creates the current element.

Its responsibilities include:

- `document.createElement()`
- text content
- properties
- attributes
- classes
- theme classes
- event listeners
- child Nodes

Conceptually:

~~~text
Resolved Spec Node
       |
       v
document.createElement()
       |
       +--> properties
       +--> attributes
       +--> classes
       +--> events
       +--> children
       |
       v
DOM Node
~~~

It should remain generic.

It should not know about:

- tables
- rows
- columns
- forms
- search
- footers

---

# 14. Why DOM Creation Is Centralized

One important architectural decision is:

> **DOM creation happens in one shared place.**

The rest of the framework primarily produces specifications.

That gives a strong boundary:

~~~text
Feature Code
     |
     v
JSON Specification
     |
     v
Transformation
     |
     v
Generic DOM Creation
~~~

If DOM creation later needs common behavior such as instrumentation, debugging, accessibility handling, or performance measurement, there is a central place to work.

---

# 15. Events

Events are represented as part of the specification and attached by the DOM layer.

Conceptually:

~~~text
Spec
 |
 | event definition
 v
DOM Builder
 |
 v
addEventListener()
~~~

The specification describes behavior.

The DOM layer attaches that behavior to the actual element.

This keeps event wiring away from table-specific rendering logic.

---

# 16. Table Renderer

The table renderer is an orchestrator.

Its responsibilities are approximately:

~~~text
Create / resolve configuration
       |
       v
Build skeleton
       |
       v
Bind events
       |
       v
Render user data
       |
       v
Return table
~~~

It should not become the place where every table feature is implemented.

That complexity belongs in the appropriate store, transformation, renderer, or helper.

---

# 17. Table Store

The table store composes the table's state domains.

Conceptually:

~~~text
tableStore
├── data
├── columns
└── footers
~~~

Each domain should own its own information.

For example:

~~~text
data
    |
    +--> original data
    +--> state data
    +--> UI data

columns
    |
    +--> original columns
    +--> UI columns
    +--> section-specific columns

footers
    |
    +--> footer definitions
    +--> footer state
~~~

This makes the store predictable.

---

# 18. Original Data vs UI Data

The original application data should remain the source of truth.

Conceptually:

~~~text
Original Data
      |
      +--> filtering
      +--> sorting
      +--> serial numbers
      +--> selection
      +--> computed values
      |
      v
UI Data
~~~

This allows UI features to evolve without corrupting the source dataset.

For example, adding:

~~~text
serialNo
~~~

does not require the application to add `serialNo` to its original data.

The table can derive it as UI data.

---

# 19. Columns

The same principle applies to columns.

A useful conceptual model is:

~~~text
Columns
├── originalColumns
├── uiColumns
├── headerColumns
├── bodyColumns
└── footerColumns
~~~

This allows the same original column definition to support different presentations.

For example:

~~~text
Body:
Name | Category | UOM

Footer:
Name |      | Total
~~~

The footer does not have to be forced to use exactly the same column presentation as the body.

---

# 20. Header, Body and Footer

The table structure is:

~~~text
table
├── thead
├── tbody
└── tfoot
~~~

Each section can be controlled independently.

For example:

~~~js
{
    showHeader: true,
    showBody: true,
    showFooter: false
}
~~~

The important point is that section visibility is transformed into the specification.

The DOM builder does not decide whether a footer should exist.

It simply renders the specification it receives.

---

# 21. Search

Search demonstrates the value of keeping data and rendering separate.

Conceptually:

~~~text
Search Input
     |
     v
Search Callback
     |
     v
Filter Original Data
     |
     v
Filtered UI Data
     |
     v
Repaint tbody
~~~

The table shell does not need to be rebuilt.

---

# 22. UI Columns

Features such as:

~~~text
Serial
Options
Edit
Delete
Checkbox
Selection
~~~

can be represented as UI columns.

Conceptually:

~~~text
Original Columns
       |
       v
Column Transformation
       |
       +--> Serial
       +--> Options
       +--> Actions
       |
       v
UI Columns
~~~

The renderer then consumes the resulting column definition.

This is preferable to scattering special cases through `thead`, `tbody`, and DOM creation.

---

# 23. Web Components

The Web Component should be a boundary around the rendering system.

Conceptually:

~~~text
<ks-table-base>
       |
       v
configuration
       |
       v
renderer
       |
       v
DOM
~~~

The Web Component itself should remain thin.

It should not become another implementation of the rendering architecture.

---

# 24. The Form Can Reuse the Same Foundation

A Form can use exactly the same infrastructure.

For example:

~~~text
Form God Spec
      |
      v
Form Theme
      |
      v
Form Pipeline
      |
      v
Resolved Form Spec
      |
      v
buildSpecElement()
      |
      v
DOM
~~~

The generic layers do not need to know that this is a Form.

---

# 25. Renderer as Presentation Strategy

This creates an important future possibility.

The same application-level schema could be rendered differently:

~~~text
             Schema
                |
        +-------+-------+
        |       |       |
        v       v       v
      Table   Form    Filter
        |       |       |
        v       v       v
      Spec    Spec    Spec
        \       |       /
         \      |      /
          +-----+-----+
                |
                v
       Recursive DOM Builder
~~~

The schema describes information.

The renderer determines presentation.

---

# 26. Adding a New Renderer

When adding a new renderer, the preferred approach is not to copy the entire Table implementation.

Instead, copy the architectural pattern:

~~~text
new-renderer/
├── God Spec
├── themes/
├── pipeline/
├── renderer
└── renderer-specific state
~~~

Reuse the shared foundation:

~~~text
runPipeline()
buildSpecElement()
domElementBuilder()
~~~

The renderer-specific code should remain focused on its own presentation.

---

# 27. What Should Stay Generic

These pieces should remain generic:

~~~text
runPipeline()
buildSpecElement()
domElementBuilder()
~~~

They should not acquire knowledge about individual UI components.

---

# 28. What Should Stay Component-Specific

These pieces can contain component knowledge:

~~~text
buildTablePipeline()
table store
table transformations
table data mapping
table column mapping
~~~

Similarly, a Form can have:

~~~text
buildFormPipeline()
form store
form transformations
form field mapping
~~~

This keeps the shared infrastructure stable.

---

# 29. The Main Architectural Boundary

The entire project can be understood as four stages:

~~~text
1. DESCRIPTION

God JSON
    |
    v

2. TRANSFORMATION

Pipeline
    |
    v

3. MATERIALIZATION

Recursive Builder
    |
    v

4. DOM

Actual UI
~~~

Themes participate in stage 2.

Data and column transformations participate in stage 2.

DOM creation happens only at stage 3.

---

# 30. Development Philosophy

When implementing a new feature, ask:

### Question 1

Can this be represented as data?

If yes, put it in the specification or store.

### Question 2

Does the specification need to change?

If yes, consider a transformation task.

### Question 3

Does the DOM builder need to understand this feature?

Usually, the answer should be **no**.

### Question 4

Does the feature require a new presentation?

If yes, consider a renderer or component-specific pipeline.

---

# 31. What to Avoid

Avoid turning the renderer into a kitchen sink.

Avoid:

~~~text
Table Renderer
    |
    +--> create DOM
    +--> apply theme
    +--> filter data
    +--> build columns
    +--> build footer
    +--> handle search
    +--> create buttons
    +--> create inputs
    +--> handle every feature
~~~

Prefer:

~~~text
Table Renderer
    |
    +--> Store
    +--> Pipeline
    +--> Skeleton
    +--> User UI
    +--> Events
~~~

with each lower layer owning its responsibility.

---

# 32. Current Mental Model

When returning to the project after a long time, remember this:

~~~text
                 WHAT?
                   |
                God JSON
                   |
                   v
                 MODIFY
                   |
          Transformation Pipeline
                   |
        +----------+----------+
        |          |          |
      Theme      Data      Columns
        |          |          |
        +----------+----------+
                   |
                   v
             Resolved JSON
                   |
                   v
              RECURSIVE
            SPEC BUILDER
                   |
                   v
                  DOM
~~~

The key sentence is:

> **The framework describes the UI, transforms the description, and only then creates the DOM.**

---

# 33. Final Architectural Principle

The Table is not the ultimate abstraction.

The deeper abstraction is:

~~~text
Declarative Specification
          +
Composable Transformations
          +
Generic Recursive DOM Materialization
~~~

The Table is currently the most advanced consumer of that foundation.

The Form should be the next proof that the architecture is genuinely reusable.

If the Form can reuse the same:

~~~text
pipeline runner
theme mechanism
recursive builder
DOM creation layer
~~~

without modifying those foundational pieces, then the architecture has successfully moved beyond being merely a Table implementation.