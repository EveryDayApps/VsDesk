# VsDesk — Feature Mapping

VsDesk reuses the visual structure and mental model of Visual Studio Code,
but replaces IDE-specific features with productivity-focused homepage tools.

Goal:
Keep the familiar UI patterns of VS Code while mapping each feature
to something useful for a daily browser home screen.

Important:
VsDesk is NOT an editor or IDE.
It is a developer dashboard inspired by VS Code.

---

# Mapping Philosophy

Principles:

- Familiar layout → lower learning curve
- Replace coding features → productivity tools
- 1–click usefulness
- Keyboard-first navigation
- Offline capable
- Lightweight

Rule:
If a feature does not help daily browsing or productivity → do not include it.

---

# High-Level Mapping Table

| VS Code Concept | VsDesk Replacement |
|---------------|-------------------|
| Files | Bookmarks |
| Editor | Notes / Widgets |
| Git branches | Profiles |
| Terminal | Quick actions |
| Extensions | Widgets |
| Command palette | Global launcher |
| Themes | Visual skins |
| Settings | App configuration |

---

# 1. Activity Bar (Left Sidebar Icons)

Purpose:
Primary navigation between major sections.

| VS Code Feature | VsDesk Feature | Description |
|---------------|---------------|-------------|
| Explorer | Bookmarks | Folder-based link manager |
| Search | Global search | Web + local search |
| Source Control | Profiles | Switch environments |
| Run/Debug | Quick actions | Shortcuts/scripts |
| Extensions | Widgets | Enable/disable modules |
| Settings | Settings | Preferences/config |

---

# 2. Explorer → Bookmark Manager

Original:
File and folder tree.

Replacement:
Structured bookmark tree.

Behavior:

VS Code → VsDesk
- File → Link
- Folder → Bookmark group
- Open → Open link
- New file → Add link
- Rename → Edit link
- Delete → Remove link
- Drag → Reorder

Example:

Work
  GitHub
  Jira
  Slack

Personal
  YouTube
  Reddit
  Gmail

Outcome:
Faster than traditional browser bookmarks.

---

# 3. Editor Area → Workspace

Original:
Code editor.

Replacement:
Multi-tab workspace for useful tools.

Possible tabs:

- Notes.md (scratchpad)
- Todo.md
- Today.md (journal)
- Quick links
- Widgets dashboard

Implementation:
Use Monaco Editor for:
- notes
- markdown
- quick text

Not intended for real coding.

Outcome:
Central productivity area.

---

# 4. Source Control → Profiles

Original:
Branches and commits.

Replacement:
Profiles (contexts/environments).

Profiles allow:

- different bookmarks
- different widgets
- different layouts
- different themes

Examples:

- Work
- Personal
- Study
- Travel

Behavior mapping:

- Branch → Profile
- Switch branch → Switch profile
- Commit → Save layout
- Changes → Activity log

Outcome:
Context-based workspace switching.

---

# 5. Command Palette → Global Launcher

Original:
Execute IDE commands.

Replacement:
Universal quick launcher.

Access:
Cmd/Ctrl + K or Cmd/Ctrl + P

Capabilities:

- Open links
- Search web
- Switch profile
- Toggle theme
- Add bookmark
- Open widget
- Run quick actions

Example:

> open github
> switch work
> add bookmark
> toggle theme

Outcome:
Keyboard-first experience.

---

# 6. Terminal → Quick Actions Panel

Original:
Shell access.

Replacement:
Shortcut/automation panel.

Possible uses:

- open downloads
- open project folder
- run scripts
- launch apps
- custom commands

Optional:
Terminal-style UI for aesthetics only.

Outcome:
Fast execution of common actions.

---

# 7. Extensions → Widgets

Original:
Install plugins.

Replacement:
Enable/disable dashboard widgets.

Examples:

- Weather
- Clock
- Calendar
- GitHub stats
- Todo list
- Notes
- RSS feed
- Crypto/Stocks

Behavior:

- Install → Enable
- Disable → Hide

Outcome:
Modular dashboard.

---

# 8. Themes → Visual System

Reuse official VS Code themes.

Apply to:

- background
- sidebar
- panels
- editor
- icons

Examples:

- Dark+
- Dracula
- Nord
- One Dark

Benefits:

- Familiar look
- Easy switching
- Consistent design

---

# 9. Settings → Preferences

App configuration only.

Include:

- theme
- layout density
- widget toggles
- profiles
- shortcuts
- import/export data

Exclude:
Advanced IDE settings.

Outcome:
Simple and minimal.

---

# Final Product Identity

VsDesk is:

- A developer homepage
- A productivity dashboard
- Inspired by VS Code layout
- Not an IDE

Think:

"VS Code shell + homepage utilities"

Result:

A fast, keyboard-friendly, distraction-free start page.
