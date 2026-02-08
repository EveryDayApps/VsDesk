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
            bg: 'color-mix(in srgb, var(--app-bg), transparent 0%)',
            sidebar: 'color-mix(in srgb, var(--sidebar-bg), transparent 0%)',
            activityBar: 'color-mix(in srgb, var(--activitybar-bg), transparent 0%)',
            statusBar: 'color-mix(in srgb, var(--statusbar-bg), transparent 0%)',
            panel: 'color-mix(in srgb, var(--panel-bg), transparent 0%)',
            titleBar: 'color-mix(in srgb, var(--titlebar-bg), transparent 0%)',
            widget: 'color-mix(in srgb, var(--widget-bg), transparent 0%)',
            input: 'color-mix(in srgb, var(--input-bg), transparent 0%)',
            'input-fg': 'color-mix(in srgb, var(--input-fg), transparent 0%)',
            'input-border': 'color-mix(in srgb, var(--input-border), transparent 0%)',
            
            hover: 'color-mix(in srgb, var(--hover-bg), transparent 0%)',
            active: 'color-mix(in srgb, var(--active-bg), transparent 0%)',
            selection: 'color-mix(in srgb, var(--selection-bg), transparent 0%)',
            'selection-fg': 'color-mix(in srgb, var(--selection-fg), transparent 0%)',
            
            border: 'color-mix(in srgb, var(--border-color), transparent 0%)',
            'border-secondary': 'color-mix(in srgb, var(--border-secondary), transparent 0%)',
            focusBorder: 'color-mix(in srgb, var(--focus-border), transparent 0%)',
            
            text: 'color-mix(in srgb, var(--text-primary), transparent 0%)',
            'text-heading': 'color-mix(in srgb, var(--text-heading), transparent 0%)',
            'text-secondary': 'color-mix(in srgb, var(--text-secondary), transparent 0%)',
            'text-muted': 'color-mix(in srgb, var(--text-muted), transparent 0%)',
            'text-error': 'color-mix(in srgb, var(--text-error), transparent 0%)',
            
            blue: 'color-mix(in srgb, var(--accent), transparent 0%)',
            accent: 'color-mix(in srgb, var(--accent), transparent 0%)',
            'accent-fg': 'color-mix(in srgb, var(--accent-fg), transparent 0%)',
            'accent-hover': 'color-mix(in srgb, var(--accent-hover), transparent 0%)',

            'btn-secondary': 'color-mix(in srgb, var(--btn-secondary-bg), transparent 0%)',
            'btn-secondary-fg': 'color-mix(in srgb, var(--btn-secondary-fg), transparent 0%)',
            'btn-secondary-hover': 'color-mix(in srgb, var(--btn-secondary-hover), transparent 0%)',

            badge: 'color-mix(in srgb, var(--badge-bg), transparent 0%)',
            'badge-fg': 'color-mix(in srgb, var(--badge-fg), transparent 0%)',
            'activityBarBadge-bg': 'color-mix(in srgb, var(--activitybar-badge-bg), transparent 0%)',

            'sidebar-fg': 'color-mix(in srgb, var(--sidebar-fg), transparent 0%)',
            'activitybar-fg': 'color-mix(in srgb, var(--activitybar-fg), transparent 0%)',
            'statusbar-fg': 'color-mix(in srgb, var(--statusbar-fg), transparent 0%)',
            'titlebar-fg': 'color-mix(in srgb, var(--titlebar-fg), transparent 0%)',

            'list-hover': 'color-mix(in srgb, var(--hover-bg), transparent 0%)',
            
            'tab-active': 'color-mix(in srgb, var(--tab-active-bg), transparent 0%)',
            'tab-active-fg': 'color-mix(in srgb, var(--tab-active-fg), transparent 0%)',
            'tab-inactive': 'color-mix(in srgb, var(--tab-inactive-bg), transparent 0%)',
            'tab-inactive-fg': 'color-mix(in srgb, var(--tab-inactive-fg), transparent 0%)',
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
