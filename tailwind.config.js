/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vscode: {
            bg: 'var(--app-bg)',
            sidebar: 'var(--sidebar-bg)',
            activityBar: 'var(--activitybar-bg)',
            statusBar: 'var(--statusbar-bg)',
            panel: 'var(--panel-bg)',
            input: 'var(--input-bg)',
            hover: 'var(--hover-bg)',
            border: 'var(--border-color)',
            'border-secondary': 'var(--border-secondary)',
            text: 'var(--text-primary)',
            'text-heading': 'var(--text-heading)',
            'text-secondary': 'var(--text-secondary)',
            'text-muted': 'var(--text-muted)',
            blue: 'var(--accent)',
            'accent-fg': 'var(--accent-fg)',
            selection: 'var(--selection-bg)',
            focusBorder: 'var(--focus-border)',
            'sidebar-fg': 'var(--sidebar-fg)',
            'activitybar-fg': 'var(--activitybar-fg)',
            'statusbar-fg': 'var(--statusbar-fg)',
            'list-hover': 'var(--hover-bg)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [
    import("tailwindcss-animate"),
  ],
}
