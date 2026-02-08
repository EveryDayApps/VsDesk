Love it. Let’s **lock the theme system properly** so it doesn’t wobble later.
Below is a **clean Phase-1 plan + High-Level Design (HLD)**, written like something you could drop straight into docs.

I’ll keep it **product-clear + engineering-clear**, no fluff.

---

# Theme System — Plan & HLD (Phase 1)

## 1. Objective

Design a **VS Code–compatible theme system** for our app that:

- Visually matches VS Code
- Supports curated built-in themes
- Allows **manual VS Code JSON import**
- Works fully offline
- Keeps UI + editor perfectly in sync
- Avoids marketplace / extension logic

> Themes are treated as **design assets**, not plugins.

---

## 2. Scope Definition

### In Scope (Phase 1)

- Built-in curated VS Code themes
- Manual `.json` theme import
- CSS variable–based UI theming
- Monaco Editor theme sync
- Local persistence
- Profile-aware theme selection (optional but compatible)

### Out of Scope (Phase 1)

- VS Code Marketplace API
- open-vsx integration
- VSIX parsing
- Auto-download / auto-update
- Cloud sync

---

## 3. Theme Sources

### 3.1 Built-in Themes

Shipped with the app.

Examples:

- Dark+
- Light+
- Dracula
- Nord
- One Dark

Characteristics:

- License verified
- Converted & normalized
- Tested with our UI
- Stored locally in repo

```
/themes/builtin/
  ├── dark-plus.json
  ├── light-plus.json
  ├── dracula.json
  └── nord.json
```

---

### 3.2 Imported Themes

User-provided `.json` files.

Source examples:

- Exported from VS Code
- Downloaded from GitHub

Rules:

- JSON only
- No URLs
- No VSIX
- Local usage only

---

## 4. Theme Data Model (HLD)

### 4.1 Internal Theme Representation

We **never use raw VS Code JSON directly**.

We normalize into our own structure:

```ts
Theme {
  id: string
  name: string
  type: "builtin" | "imported"
  colors: UIColors
  editorTheme: MonacoTheme
  metadata: {
    source?: string
    importedAt?: number
  }
}
```

---

### 4.2 UI Color Tokens (Design System)

We define a **fixed set of CSS variables**.

These are the only variables the UI consumes.

```css
--app-bg
--editor-bg
--sidebar-bg
--activitybar-bg
--panel-bg

--text-primary
--text-secondary
--text-muted

--border-color
--accent
--focus-border
```

This guarantees:

- UI stability
- Predictable rendering
- Theme compatibility

---

### 4.3 VS Code → App Token Mapping

A **controlled mapping layer** converts VS Code tokens.

Example:

| VS Code Token          | App Variable     |
| ---------------------- | ---------------- |
| editor.background      | --editor-bg      |
| sideBar.background     | --sidebar-bg     |
| activityBar.background | --activitybar-bg |
| foreground             | --text-primary   |
| focusBorder            | --accent         |
| panel.background       | --panel-bg       |

Unmapped tokens:

- Ignored
- Or fallback to defaults

This prevents broken layouts.

---

## 5. Architecture Overview

### 5.1 High-Level Flow

```
Theme JSON
   ↓
Theme Loader
   ↓
Normalization Layer
   ↓
 ┌───────────────┐
 │ CSS Variables │ → UI (ActivityBar, Sidebar, Panels)
 └───────────────┘
   ↓
Monaco Theme
   ↓
Editor
```

Single source of truth → **Theme Manager**

---

### 5.2 Core Components

#### ThemeManager

Responsibilities:

- Load themes
- Apply themes
- Persist selection
- Notify UI

Singleton / service.

---

#### ThemeLoader

Responsibilities:

- Parse JSON
- Validate shape
- Normalize tokens
- Build Theme object

---

#### ThemeApplier

Responsibilities:

- Inject CSS variables into `:root`
- Register & apply Monaco theme

---

## 6. Theme Import Flow (Detailed)

### Step 1 — User Action

```
Settings → Themes → Import Theme
```

User selects `.json` file.

---

### Step 2 — Validation

Checks:

- Valid JSON
- Has `colors` object

If invalid:

- Show clear error
- Do not crash

---

### Step 3 — Normalization

- Extract supported tokens
- Apply fallbacks
- Build internal Theme object

---

### Step 4 — Apply

- Update CSS variables
- Update Monaco theme
- UI + editor update together

---

### Step 5 — Persist

Store:

- Theme data
- Active theme ID

Storage:

- IndexedDB / localStorage

---

## 7. Theme Switching Rules

- Switching is instant
- No page reload
- One active theme at a time
- Imported themes marked as “Custom”

Optional (future-ready):

- Per-profile theme binding

---

## 8. Error & Fallback Strategy

### Broken / Incomplete Themes

- Missing UI tokens → fallback colors
- Missing editor tokens → Monaco defaults

### Invalid JSON

- Block import
- Clear error message

### Safety Rule

> UI must **never** become unreadable.

---

## 9. Folder Structure (Theme)

```
/theme/
  ├── ThemeManager.ts
  ├── ThemeLoader.ts
  ├── ThemeApplier.ts
  ├── tokenMap.ts
  ├── defaults.ts
/themes/
  └── builtin/
```

---

## 10. Non-Goals (Explicit)

Phase 1 theme system will **not**:

- Fetch themes from internet
- Execute extension code
- Parse VSIX
- Depend on VS Code APIs

This keeps the system:

- Legal
- Stable
- Maintainable

---

## 11. Future Compatibility

This design allows future phases to add:

- Curated theme gallery
- open-vsx catalog (metadata only)
- Theme previews
- Cloud sync

Without changing the core architecture.

---

## 12. Definition of Done (Theme System)

- Built-in themes load correctly
- Imported JSON themes apply safely
- UI + editor colors match
- Theme switch < 50ms
- No network dependency
- Works offline
- No broken UI states

---
