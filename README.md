# VS Home - Developer Dashboard

A VS Code-inspired browser homepage dashboard built with React, TypeScript, Vite, and Tailwind CSS.
Designed to run locally or as a static site.

## Features

- 🎨 **VS Code Aesthetics**: Dark theme, file explorer sidebar, activity bar, and status bar.
- ⚡ **Quick Access**: Curated grid of developer tools (GitHub, ChatGPT, Vercel, etc).
- 🕒 **Live Clock**: Elegant time and date display.
- 🔍 **Search**: Google search bar with VS Code input styling.
- 📝 **Notes**: Persistent scratchpad (saved to LocalStorage).
- ✅ **Todos**: Persistent task list (saved to LocalStorage).
- ⌨️ **Command Palette**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) to access quick actions.
- 📱 **Responsive**: Works on all screen sizes.

## Project Structure

```
src/
├── components/
│   ├── layout/       # VS Code shell (ActivityBar, Sidebar, TitleBar, StatusBar)
│   └── widgets/      # Dashboard widgets (Clock, Notes, Todos, QuickLinks)
├── hooks/            # Custom hooks (useLocalStorage, useTime, useTheme)
├── utils/            # Utilities (cn for Tailwind class merging)
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

- **Theme**: Modify `tailwind.config.js` to change the specialized `vscode-*` colors.
- **Links**: Edit `src/components/widgets/QuickLinks.tsx` to update the shortcut grid.

## License

MIT
