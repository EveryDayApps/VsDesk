import { themeStore } from '../db/stores/themeStore';
import { ThemeApplier } from './ThemeApplier';
import { ThemeLoader } from './ThemeLoader';
import type { Theme } from './types';

const ACTIVE_THEME_KEY = 'vsdesk-active-theme';
const DEFAULT_THEME_ID = 'dark-plus';

type ThemeChangeCallback = (theme: Theme) => void;

export class ThemeManager {
  private themes = new Map<string, Theme>();
  private activeThemeId: string = DEFAULT_THEME_ID;
  private loader = new ThemeLoader();
  private applier = new ThemeApplier();
  private listeners = new Set<ThemeChangeCallback>();
  private initialized = false;

  /**
   * Initialize the theme system.
   * Loads built-in themes, imported themes from IndexedDB,
   * and applies the persisted active theme.
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    // Load built-in themes
    const builtins = this.loader.loadAllBuiltins();
    for (const theme of builtins) {
      this.themes.set(theme.id, theme);
    }

    // Load imported themes from IndexedDB
    try {
      const records = await themeStore.getAll();
      for (const record of records) {
        const theme: Theme = {
          id: record.id,
          name: record.name,
          type: 'imported',
          base: record.base,
          colors: record.colors,
          metadata: {
            source: 'user-import',
            importedAt: record.importedAt,
          },
        };
        this.themes.set(theme.id, theme);
      }
    } catch (err) {
      console.error('Failed to load imported themes:', err);
    }

    // Restore active theme from localStorage
    const savedId = localStorage.getItem(ACTIVE_THEME_KEY);
    if (savedId && this.themes.has(savedId)) {
      this.activeThemeId = savedId;
    } else {
      this.activeThemeId = DEFAULT_THEME_ID;
    }

    // Apply the active theme
    const activeTheme = this.themes.get(this.activeThemeId);
    if (activeTheme) {
      this.applier.apply(activeTheme);
    }

    this.initialized = true;
  }

  /**
   * Returns all available themes.
   */
  getThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Returns the currently active theme.
   */
  getActiveTheme(): Theme {
    return this.themes.get(this.activeThemeId) || this.themes.get(DEFAULT_THEME_ID)!;
  }

  /**
   * Returns the active theme ID.
   */
  getActiveThemeId(): string {
    return this.activeThemeId;
  }

  /**
   * Switches to a different theme by ID.
   */
  async setTheme(id: string): Promise<void> {
    const theme = this.themes.get(id);
    if (!theme) {
      throw new Error(`Theme not found: ${id}`);
    }

    this.activeThemeId = id;
    localStorage.setItem(ACTIVE_THEME_KEY, id);
    this.applier.apply(theme);
    this.notifyListeners(theme);
  }

  /**
   * Imports a theme from a JSON string.
   * Persists it to IndexedDB and returns the Theme.
   */
  async importTheme(jsonString: string): Promise<Theme> {
    const theme = this.loader.parseImport(jsonString);

    // Persist to IndexedDB
    await themeStore.put({
      id: theme.id,
      name: theme.name,
      base: theme.base,
      colors: theme.colors,
      importedAt: theme.metadata.importedAt || Date.now(),
    });

    this.themes.set(theme.id, theme);
    return theme;
  }

  /**
   * Deletes an imported theme. Cannot delete built-in themes.
   * If the deleted theme was active, falls back to Dark+.
   */
  async deleteTheme(id: string): Promise<void> {
    const theme = this.themes.get(id);
    if (!theme) return;
    if (theme.type === 'builtin') {
      throw new Error('Cannot delete built-in themes.');
    }

    await themeStore.delete(id);
    this.themes.delete(id);

    // Fall back to default if the active theme was deleted
    if (this.activeThemeId === id) {
      await this.setTheme(DEFAULT_THEME_ID);
    }
  }

  /**
   * Subscribe to theme changes. Returns an unsubscribe function.
   */
  onChange(callback: ThemeChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(theme: Theme): void {
    for (const callback of this.listeners) {
      callback(theme);
    }
  }
}

export const themeManager = new ThemeManager();
