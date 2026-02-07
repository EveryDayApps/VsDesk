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
            bg: '#1e1e1e',
            sidebar: '#252526',
            activityBar: '#333333',
            statusBar: '#007acc',
            panel: '#1e1e1e',
            input: '#3c3c3c',
            hover: '#2a2d2e',
            border: '#3e3e42',
            text: '#cccccc',
            blue: '#0e639c'
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
