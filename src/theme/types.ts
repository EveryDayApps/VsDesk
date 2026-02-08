export interface Theme {
  id: string;
  name: string;
  type: 'builtin' | 'imported';
  base: 'dark' | 'light';
  colors: Record<string, string>;
  metadata: {
    source?: string;
    importedAt?: number;
  };
}

export interface ThemeRecord {
  id: string;
  name: string;
  base: 'dark' | 'light';
  colors: Record<string, string>;
  importedAt: number;
}

export interface VSCodeThemeJSON {
  name?: string;
  type?: 'dark' | 'light' | 'hc';
  colors?: Record<string, string>;
  tokenColors?: unknown[];
}
