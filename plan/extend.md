# VS Code-Style Homepage — Implementation Plan

Goal:
Recreate a browser homepage that visually and functionally feels like Visual Studio Code,
focusing ONLY on:

1. VS Code-like components (layout + editor + icons)
2. VS Code theme reuse (colors + styling)

Tech stack:
- Bun
- TypeScript
- React
- Vite
- Tailwind

---

## 1️⃣ VS Code-like Components

### Objective
Reuse existing open-source tools to replicate the VS Code interface instead of building everything from scratch.

---

### 1.1 Editor Component

Use:
- Monaco Editor (same editor engine used inside VS Code)

Responsibilities:
- Code viewer or notes editor
- Syntax highlighting
- Minimap
- Themes support
- IntelliSense (optional)

Steps:
- Install @monaco-editor/react
- Create EditorWrapper component
- Load theme dynamically
- Disable heavy features not needed for homepage

Output:
- Reusable <CodeEditor /> component

---

### 1.2 Layout System

### Sidebar + Panels

Use:
- Tailwind Flex/Grid
- or react-split-pane for resizable panels

Layout Structure:
ActivityBar | Sidebar | Main | Terminal

Component plan:
- ActivityBar.tsx (icons only)
- Sidebar.tsx (links/widgets)
- Workspace.tsx (editor/widgets)
- TerminalPanel.tsx (optional)

Features:
- Resizable panes
- Collapsible sidebar
- Keyboard shortcuts

Output:
- IDE-style workspace layout

---

### 1.3 Icons

Use:
- VS Code Codicons

Steps:
- Install @vscode/codicons
- Import CSS
- Replace emojis with codicons

Output:
- Authentic VS Code look

---

## 2️⃣ VS Code Theme Reuse

### Objective
Reuse official VS Code theme colors to match real VS Code appearance.

---

### 2.1 Theme Source

Source themes from:
- VS Code Marketplace
- Theme JSON files

These include:
- editor.background
- sidebar.background
- activityBar.background
- foreground colors

---

### 2.2 Theme Conversion Strategy

Convert theme tokens → CSS variables

Example:
--editor-bg
--sidebar-bg
--text-primary
--accent

Steps:
- Parse theme JSON
- Map tokens to CSS vars
- Inject into :root

Output:
- Dynamic theming system

---

### 2.3 Tailwind Integration

Configure Tailwind to use variables

Example:
colors: {
  bg: "var(--editor-bg)",
  sidebar: "var(--sidebar-bg)"
}

Benefits:
- Centralized theming
- Easy theme switching
- Consistent UI colors

---

### 2.4 Monaco Theme Sync

Load same theme into Monaco:

- defineTheme()
- setTheme()

Ensures:
- Editor + UI share identical colors

Output:
- Perfect visual consistency

---

## Deliverables

Components:
- CodeEditor
- ActivityBar
- Sidebar
- Workspace layout

Theme:
- theme-loader utility
- CSS variable system
- Tailwind mapping
- Monaco theme integration

Result:
- Homepage visually identical to VS Code
- Theme switchable
- Fully browser-based
