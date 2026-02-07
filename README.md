# VS Home - Developer Dashboard

A VS Code-inspired browser homepage dashboard built with React, TypeScript, Vite, Tailwind CSS, and **@vscode-elements/elements** for authentic VS Code UI components.
Designed to run locally or as a static site.

## Features

- 🎨 **Authentic VS Code UI**: Uses official vscode-elements web components for pixel-perfect VS Code aesthetics
- 🧩 **VS Code Components**: Leverages vscode-button, vscode-textfield, vscode-textarea, vscode-checkbox, vscode-badge, and vscode-scrollable
- ⚡ **Quick Access**: Curated grid of developer tools (GitHub, ChatGPT, Vercel, etc).
- 🕒 **Live Clock**: Elegant time and date display.
- 🔍 **Search**: Google search bar with VS Code input styling.
- 📝 **Notes**: Persistent scratchpad using vscode-textarea (saved to LocalStorage).
- ✅ **Todos**: Persistent task list with vscode-checkboxes (saved to LocalStorage).
- ⌨️ **Command Palette**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) to access quick actions.
- 📱 **Responsive**: Works on all screen sizes.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **@vscode-elements/elements** - Official VS Code web components
- **Lucide React** - Icon library
- **Framer Motion** - Animations

## Project Structure

```
src/
├── components/
│   ├── layout/       # VS Code shell (ActivityBar, Sidebar, TitleBar, StatusBar)
│   └── widgets/      # Dashboard widgets (Clock, Notes, Todos, QuickLinks)
├── hooks/            # Custom hooks (useLocalStorage, useTime, useTheme)
├── utils/            # Utilities (cn for Tailwind class merging)
├── vscode-elements-setup.ts  # VSCode Elements component imports
├── vscode-elements.d.ts      # TypeScript declarations for web components
├── App.tsx           # Main application layout
└── main.tsx          # Entry point
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (Recommended) or Node.js

### Installation

1.  **Install dependencies**:
    ```bash
    bun install
    ```

2.  **Start development server**:
    ```bash
    bun dev
    ```

3.  **Build for production**:
    ```bash
    bun run build
    ```

### Usage

- **Set as Homepage**: Build the project and serve the `dist` folder, or use an extension like "Custom New Tab URL" to point to the hosted version.
- **Data Persistence**: All data (notes, todos) is stored in your browser's `localStorage`. Clearing cache will clear data.

## Customization

- **Theme**: Modify `src/index.css` CSS variables to change the vscode-elements theme colors.
- **Links**: Edit `src/components/widgets/QuickLinks.tsx` to update the shortcut grid.
- **Components**: All vscode-elements components are imported in `src/vscode-elements-setup.ts`.

## VSCode Elements Integration

This project uses the official [@vscode-elements/elements](https://github.com/vscode-elements/elements) library to provide authentic VS Code UI components. The components are web components that match the look and feel of Visual Studio Code's native UI.

### Components Used
- `vscode-button` - Buttons with primary, secondary, and icon variants
- `vscode-textfield` - Text input fields
- `vscode-textarea` - Multi-line text areas
- `vscode-checkbox` - Checkboxes for task completion
- `vscode-badge` - Small labels and counters
- `vscode-scrollable` - Scrollable containers

## License

MIT
