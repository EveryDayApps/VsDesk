import type { Theme } from './types';
import { DARK_DEFAULTS, LIGHT_DEFAULTS, VSCODE_ELEMENT_DEFAULTS } from './defaults';
import { APP_TOKEN_MAP, BORDER_FALLBACK_KEYS, VSCODE_ELEMENT_MAP } from './tokenMap';

export class ThemeApplier {
  /**
   * Applies a theme to the document.
   * Sets CSS variables on :root, updates color-scheme, and syncs vscode-elements vars.
   */
  apply(theme: Theme): void {
    const root = document.documentElement;
    const defaults = theme.base === 'dark' ? DARK_DEFAULTS : LIGHT_DEFAULTS;
    const vscodeDefaults = VSCODE_ELEMENT_DEFAULTS[theme.base];

    // 1. Set app design system CSS variables
    this.setAppVariables(root, theme, defaults);

    // 2. Set --vscode-* variables for web components
    this.setVSCodeElementVariables(root, theme, vscodeDefaults);

    // 3. Update color-scheme and dark/light class
    this.updateColorScheme(root, theme.base);

    // 4. Update root-level styles
    root.style.setProperty('background-color', `var(--app-bg)`);
    root.style.setProperty('color', `var(--text-primary)`);
  }

  private setAppVariables(
    root: HTMLElement,
    theme: Theme,
    defaults: Record<string, string>,
  ): void {
    const setVars = new Set<string>();

    // Apply mapped tokens
    for (const [vsKey, cssVar] of Object.entries(APP_TOKEN_MAP)) {
      const value = theme.colors[vsKey];
      if (value) {
        root.style.setProperty(cssVar, value);
        setVars.add(cssVar);
      }
    }

    // Handle border-color fallback chain
    if (!setVars.has('--border-color')) {
      for (const key of BORDER_FALLBACK_KEYS) {
        if (theme.colors[key]) {
          root.style.setProperty('--border-color', theme.colors[key]);
          setVars.add('--border-color');
          break;
        }
      }
    }

    // Apply defaults for any missing variables
    for (const [cssVar, defaultValue] of Object.entries(defaults)) {
      if (!setVars.has(cssVar)) {
        root.style.setProperty(cssVar, defaultValue);
      }
    }
  }

  private setVSCodeElementVariables(
    root: HTMLElement,
    theme: Theme,
    defaults: Record<string, string>,
  ): void {
    const setVars = new Set<string>();

    // Apply mapped tokens
    for (const [vsKey, cssVar] of Object.entries(VSCODE_ELEMENT_MAP)) {
      const value = theme.colors[vsKey];
      if (value) {
        root.style.setProperty(cssVar, value);
        setVars.add(cssVar);
      }
    }

    // Apply defaults for any missing variables
    for (const [cssVar, defaultValue] of Object.entries(defaults)) {
      if (!setVars.has(cssVar)) {
        root.style.setProperty(cssVar, defaultValue);
      }
    }
  }

  private updateColorScheme(root: HTMLElement, base: 'dark' | 'light'): void {
    // Update color-scheme for browser defaults (scrollbars, form controls)
    root.style.setProperty('color-scheme', base);

    // Update dark/light class for Tailwind
    root.classList.remove('light', 'dark');
    root.classList.add(base);
  }
}

export const themeApplier = new ThemeApplier();
