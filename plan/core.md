# VsDesk — Implementation Plan

VsDesk is a developer-focused browser homepage that mimics the look and feel of Visual Studio Code.

Scope is intentionally limited to:

1. VS Code-like components (layout, editor, icons)
2. VS Code theme reuse (colors + visual system)

Tech Stack:

- Bun
- TypeScript
- React
- Vite
- Tailwind CSS

Out of scope:

- Backend services
- Auth
- Cloud sync
- Complex widgets

---

# 1. VS Code-like Components

Goal:
Reuse existing proven libraries instead of rebuilding IDE UI from scratch.

---

## 1.1 Editor

Library:

- Monaco Editor (same engine used by VS Code)

Responsibilities:

- Notes / scratchpad editor
- Syntax highlighting
- Theme support
- Lightweight usage

Tasks:

- Install @monaco-editor/react
- Create CodeEditor component
- Lazy load editor for performance
- Disable heavy features (linting, workers if unnecessary)

Deliverable:

- /components/editor/CodeEditor.tsx

---

## 1.2 Layout System

Goal:
Replicate IDE structure.

Layout:

Activity Bar | Sidebar | Workspace | Optional Bottom Panel

Implementation:

- Tailwind flex/grid
- react-split-pane for resizing

Components:

- ActivityBar
- Sidebar
- Workspace
- Panel (optional)

Features:

- Resizable panes
- Collapsible sidebar
- Keyboard shortcuts
- Responsive behavior

Deliverable:

- /layout folder with reusable layout components

---

## 1.3 Icons

Library:

- VS Code Codicons

Tasks:

- Install @vscode/codicons
- Import CSS globally
- Replace emojis with codicons

Result:

- Authentic VS Code visual style

Deliverable:

- Icon wrapper component

---

# 2. VS Code Theme Reuse

Goal:
Match official VS Code themes exactly.

---

## 2.1 Theme Source

Themes obtained from:

- VS Code Marketplace
- Theme JSON exports

These contain:

- editor colors
- sidebar colors
- activity bar colors
- token styles

---

## 2.2 Theme Token Mapping

Strategy:
Map theme tokens → CSS variables

Example:
--editor-bg
--sidebar-bg
--activitybar-bg
--text-primary
--accent

Tasks:

- Create theme-loader utility
- Parse JSON
- Generate CSS variables
- Inject into :root

Deliverable:

- /theme/themeLoader.ts

---

## 2.3 Tailwind Integration

Configure Tailwind to use CSS variables.

Example:
colors:
bg: var(--editor-bg)
sidebar: var(--sidebar-bg)

Benefits:

- Global consistency
- Easy theme switching
- No duplicated colors

Deliverable:

- tailwind.config.ts updated

---

## 2.4 Monaco Theme Sync

Steps:

- Convert VS Code theme JSON to Monaco format
- defineTheme()
- setTheme()

Result:

- Editor matches UI exactly

Deliverable:

- /theme/monacoTheme.ts

---

# 3. Folder Structure

src/
components/
editor/
icons/
layout/
theme/
styles/
App.tsx
main.tsx

---

# 4. Milestones

Phase 1:

- Project setup (Bun + Vite + Tailwind)

Phase 2:

- Layout components

Phase 3:

- Monaco integration

Phase 4:

- Theme system

Phase 5:

- Polish + performance

---

# 5. Definition of Done

- Layout visually matches VS Code
- Editor embedded and functional
- Codicons integrated
- Theme loads from JSON
- UI + editor share identical colors
- Works offline as static build
- Loads under 1s

---

# Result

VsDesk becomes:

- Lightweight
- Fully static
- Themeable
- VS Code-like workspace homepage
