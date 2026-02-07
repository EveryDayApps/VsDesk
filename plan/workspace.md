# Workspace-Based Main Screen — Implementation Plan

## Feature Overview

The app follows a **workspace-based UI architecture**.
There is a single, persistent application shell, and one **main workspace area** that dynamically renders different features (Home, Notes, Settings, Widgets, etc.) based on user selection.

The goal is to avoid traditional page navigation and instead switch **workspace views** inside the same UI.

---

## Goals

- One default main screen on app launch
- Same layout structure at all times
- Allow different features to occupy the main workspace
- Fast context switching (no full page reloads)
- Keyboard-first, VS Code–like mental model
- Easy to extend with new workspace views in the future

---

## Non-Goals

- No real IDE functionality
- No deep routing per feature (keep routing shallow)
- No backend dependency for workspace switching

---

## High-Level Architecture

### App Shell (Persistent)

Always visible:

- Activity Bar (primary navigation)
- Sidebar (contextual controls)
- Top Bar (optional)
- Status Bar (optional)

Never changes across features.

---

### Main Workspace (Dynamic)

A single content region responsible for rendering the active workspace view.

Only this area updates when the user switches features.

---

## Workspace View Concept

Each feature is implemented as a **Workspace View**.

Examples:

- Home Workspace
- Notes Workspace
- Settings Workspace
- Widgets Workspace
- Bookmark Manager Workspace

All workspace views follow the same contract.

---

## Workspace View Contract

Each workspace view should define:

- `id` – unique identifier
- `title` – display name
- `icon` – activity bar icon
- `render()` – UI rendered inside the workspace
- `sidebarConfig` – optional sidebar content
- `defaultState` – initial data/state

This ensures consistency and plug-and-play behavior.

---

## Default Workspace Behavior

- App launches with a configurable **default workspace**
- Default workspace can be:
  - Home
  - Notes
  - Last opened workspace

- Stored locally (localStorage / indexedDB)

---

## Workspace Switching Flow

1. User clicks an icon in the Activity Bar
2. App updates `activeWorkspaceId`
3. Sidebar updates based on workspace context
4. Main workspace renders the selected view

No route change required.

---

## Sidebar Behavior

Sidebar is **workspace-aware**.

Examples:

- Notes Workspace → file list / note tree
- Settings Workspace → settings categories
- Home Workspace → widgets list

Sidebar content is driven by the active workspace.

---

## State Management Strategy

Recommended:

- Central `WorkspaceManager`
- Stores:
  - activeWorkspaceId
  - workspace-specific UI state

Each workspace manages its **own internal state**, isolated from others.

---

## Keyboard Navigation

Planned shortcuts:

- Switch workspace (Cmd/Ctrl + 1..9)
- Command palette (Cmd/Ctrl + K)
- Toggle sidebar
- Focus workspace

Keyboard actions operate on the workspace layer, not pages.

---

## Extensibility Rules

To add a new workspace:

1. Create a new Workspace View
2. Register it with the Workspace Manager
3. Add icon entry in Activity Bar

No changes required to layout or shell.

---

## Performance Considerations

- Lazy load workspace views
- Keep inactive workspaces unmounted or cached
- Avoid heavy re-renders of the app shell

---

## Risks & Mitigations

**Risk:** Workspace complexity grows

- Mitigation: Strict workspace contract

**Risk:** Sidebar becomes bloated

- Mitigation: Workspace-owned sidebar configs

---

## Definition of Done

- Single persistent app shell
- One dynamic main workspace region
- Multiple workspace views supported
- Default workspace loads on launch
- Clean switching without page reloads
- Easy to add new workspace views

---

## Summary

This plan establishes a **workspace-centric main screen** where features behave like tools inside a shared environment rather than separate pages.

It mirrors the mental model of VS Code while remaining lightweight and purpose-built for a productivity homepage.

Perfect question 👌
Let’s explain this **purely in HLD terms** — no framework, no code — just **how the system works conceptually**.

I’ll keep it clean, structured, and something you can literally paste into a design doc.

---

# High-Level Design (HLD): Workspace-Based Main Screen

## 1. System Overview

The application is designed around a **single persistent shell** with a **dynamic workspace region**.

Instead of navigating between pages, the system **switches active workspace views** inside the same layout.

> At any point in time, exactly **one workspace is active**.

---

## 2. Core Design Principle

### **Single Shell, Multiple Workspaces**

- The **shell** (Activity Bar, Sidebar, Header, Status Bar) is always present
- The **workspace** is the only region that changes
- Features do not control navigation — they **register as workspaces**

This ensures:

- Predictable layout
- Low cognitive load
- Fast context switching

---

## 3. High-Level Components

### 3.1 App Shell

**Responsibility**

- Provide a stable UI frame
- Host navigation controls
- Never depend on business logic of features

**Includes**

- Activity Bar (primary workspace selector)
- Sidebar (workspace-scoped controls)
- Main Workspace Container
- Optional Status Bar

**Key Property**

- Shell is **stateless with respect to features**

---

### 3.2 Workspace Manager (Central Controller)

This is the **heart of the system**.

**Responsibilities**

- Maintain the currently active workspace
- Register all available workspaces
- Handle workspace switching
- Persist last active workspace (optional)

**Owns**

- `activeWorkspaceId`
- `registeredWorkspaces[]`

**Does NOT**

- Render UI directly
- Know feature internals

---

### 3.3 Workspace Views (Feature Units)

Each feature is implemented as a **Workspace View**.

A workspace view is a **self-contained functional unit** that:

- Knows how to render itself
- Knows what sidebar controls it needs
- Manages its own internal state

Examples:

- Home Workspace
- Notes Workspace
- Settings Workspace

---

## 4. Workspace View Contract (Conceptual Interface)

Each workspace must expose the same **high-level contract**.

Conceptually:

- **Identity**
  - ID
  - Title
  - Icon

- **Presentation**
  - Main workspace content
  - Optional sidebar content

- **Lifecycle**
  - Initialize
  - Activate
  - Deactivate

This contract allows the shell to treat all workspaces uniformly.

---

## 5. Runtime Flow (How It Actually Works)

### 5.1 App Startup

1. App Shell initializes
2. Workspace Manager loads registered workspaces
3. Default workspace is resolved:
   - User preference
   - Last opened workspace
   - Fallback (Home)

4. Workspace Manager sets `activeWorkspace`
5. Shell renders:
   - Sidebar → from active workspace
   - Workspace → from active workspace

---

### 5.2 Workspace Switching

1. User clicks Activity Bar icon
2. Activity Bar sends `workspaceId` to Workspace Manager
3. Workspace Manager:
   - Deactivates current workspace
   - Activates target workspace
   - Updates `activeWorkspaceId`

4. Shell updates:
   - Sidebar content
   - Main workspace content

No navigation, no reload, no layout change.

---

## 6. Sidebar as a Contextual Component

The Sidebar is **not a global feature**.

It is:

- Owned logically by the active workspace
- Rendered by the shell

Example:

- Notes workspace → note tree
- Settings workspace → settings categories
- Home workspace → widget list

This avoids a bloated global sidebar.

---

## 7. State Management (HLD View)

### State Boundaries

- **Global**
  - Active workspace ID
  - User preferences

- **Workspace-local**
  - Internal UI state
  - Feature-specific data

### Rule

> No workspace can directly mutate another workspace’s state.

This keeps features isolated and safe.

---

## 8. Extensibility Model

Adding a new feature does **not affect existing ones**.

High-level steps:

1. Implement a new workspace view
2. Register it with Workspace Manager
3. Add an Activity Bar entry

No shell changes required.

This makes the system **open for extension, closed for modification**.

---

## 9. Failure & Recovery Behavior

- If a workspace fails to load:
  - Workspace Manager falls back to Home

- If a workspace is disabled:
  - It is not registered

- Shell remains stable in all cases

---

## 10. Why This HLD Works Well

### Technical Benefits

- Clear separation of concerns
- Predictable rendering
- Easy lazy loading
- Safe state isolation

### Product Benefits

- Feels fast
- Familiar IDE-like experience
- No “page hopping”
- Scales well as features grow

---

## 11. One-Line HLD Summary

> The system uses a **workspace-centric architecture** where a persistent application shell dynamically renders exactly one active workspace at a time, enabling feature switching without navigation or layout changes.

---
