import type { Theme, VSCodeThemeJSON } from './types';

import darkPlusJson from '../themes/builtin/dark-plus.json';
import lightPlusJson from '../themes/builtin/light-plus.json';
import monokaiJson from '../themes/builtin/monokai.json';

const BUILTIN_THEMES: Record<string, VSCodeThemeJSON> = {
  'dark-plus': darkPlusJson as VSCodeThemeJSON,
  'light-plus': lightPlusJson as VSCodeThemeJSON,
  'monokai': monokaiJson as VSCodeThemeJSON,
};

export class ThemeLoader {
  /**
   * Validates raw JSON as a VS Code theme.
   * Returns the typed object if valid, null otherwise.
   */
  validate(raw: unknown): VSCodeThemeJSON | null {
    if (!raw || typeof raw !== 'object') return null;

    const json = raw as Record<string, unknown>;

    if (!json.colors || typeof json.colors !== 'object') return null;

    // Must have at least some color entries
    const colorKeys = Object.keys(json.colors as object);
    if (colorKeys.length === 0) return null;

    return raw as VSCodeThemeJSON;
  }

  /**
   * Normalizes a VS Code theme JSON into our internal Theme format.
   */
  normalize(
    id: string,
    json: VSCodeThemeJSON,
    type: 'builtin' | 'imported',
  ): Theme {
    const base = this.resolveBase(json.type);

    return {
      id,
      name: json.name || id,
      type,
      base,
      colors: { ...(json.colors || {}) },
      metadata: {
        source: type === 'builtin' ? 'built-in' : 'user-import',
        importedAt: type === 'imported' ? Date.now() : undefined,
      },
    };
  }

  /**
   * Loads a single built-in theme by ID.
   */
  loadBuiltin(id: string): Theme | null {
    const json = BUILTIN_THEMES[id];
    if (!json) return null;
    return this.normalize(id, json, 'builtin');
  }

  /**
   * Loads all built-in themes.
   */
  loadAllBuiltins(): Theme[] {
    return Object.entries(BUILTIN_THEMES).map(([id, json]) =>
      this.normalize(id, json, 'builtin'),
    );
  }

  /**
   * Parses and validates a user-provided JSON string.
   * Returns the Theme on success, throws on failure.
   */
  parseImport(jsonString: string): Theme {
    let raw: unknown;
    try {
      raw = JSON.parse(jsonString);
    } catch {
      throw new Error('Invalid JSON: could not parse the file.');
    }

    const validated = this.validate(raw);
    if (!validated) {
      throw new Error('Invalid theme: must contain a "colors" object with color entries.');
    }

    const id = `imported-${Date.now()}`;
    return this.normalize(id, validated, 'imported');
  }

  private resolveBase(type?: string): 'dark' | 'light' {
    if (type === 'light') return 'light';
    return 'dark';
  }
}

export const themeLoader = new ThemeLoader();
