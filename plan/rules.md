# VsDesk — Rules & Conventions

This document defines the **non-negotiable rules** for building VsDesk.
All contributors and AI agents must follow these rules strictly.

---

## 1. Runtime & Tooling

* **Bun is mandatory**

  * Use Bun as the package manager and runtime
  * No npm, yarn, or pnpm
  * Scripts must be compatible with Bun

* TypeScript is required

* Strict mode should be enabled wherever possible

---

## 2. Code Quality Standards

* Code must be **clean, readable, and maintainable**
* Follow clear separation of concerns

  * UI logic ≠ business logic ≠ state management
* Avoid quick hacks or temporary solutions
* Prefer explicit code over clever code

Required:

* Meaningful naming (files, variables, components)
* Small, focused components
* Predictable data flow
* Defensive handling of edge cases

---

## 3. UI vs Logic Separation

* **UI and logic must be clearly separated**

Examples:

* UI components → rendering, layout, styles only
* Logic → state, transformations, helpers, services

Do NOT:

* Put heavy logic inside UI components
* Mix data fetching or state mutations directly into views

---

## 4. UI Component Rules (Very Important)

* **ONLY use VS Code components by default**

  * Use VS Code–style components and libraries
  * Match real VS Code behavior and visuals

* **DO NOT create custom UI components unless explicitly told**

  * No custom buttons
  * No custom panels
  * No custom widgets

Custom UI components are allowed **only when explicitly approved**.

If unsure → do NOT create a custom component.

---

## 5. Folder & File Structure

* Follow a **clean, predictable folder structure**
* Group files by responsibility, not by size

Rules:

* Components must live in appropriate feature folders
* No random or flat file dumping
* Index files only when they improve clarity

Bad:

* components.ts
* utils.ts with everything inside

Good:

* components/layout/
* components/editor/
* features/bookmarks/
* features/profiles/

---

## 6. Consistency Rules

* Be consistent with:

  * Naming
  * Folder structure
  * Imports
  * Styling approach

If a pattern exists, **follow it**.
Do not introduce new patterns without a strong reason.

---

## 7. Decision Authority

* These rules override convenience
* These rules override speed
* These rules override personal preference

If something conflicts with these rules, **the rules win**.

---

## Final Note

VsDesk aims to feel like **VS Code itself**, not a themed web app.

Discipline > shortcuts.
Consistency > creativity (unless explicitly allowed).
