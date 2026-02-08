/**
 * Default CSS variable values for dark and light base themes.
 * Used as fallbacks when a theme doesn't define certain tokens.
 */

export const DARK_DEFAULTS: Record<string, string> = {
  // Layout
  '--app-bg': '#1e1e1e',
  '--sidebar-bg': '#252526',
  '--activitybar-bg': '#333333',
  '--panel-bg': '#1e1e1e',
  '--statusbar-bg': '#007acc',
  '--titlebar-bg': '#3c3c3c',
  '--widget-bg': '#252526',
  '--input-bg': '#3c3c3c',
  '--input-fg': '#cccccc',
  '--input-border': '#3e3e42',

  // Interactive
  '--hover-bg': '#2a2d2e',
  '--selection-bg': '#04395e',
  '--selection-fg': '#ffffff',
  '--active-bg': '#37373d',

  // Text
  '--text-primary': '#cccccc',
  '--text-secondary': '#969696',
  '--text-muted': '#858585',
  '--text-heading': '#d4d4d4',

  // Borders
  '--border-color': '#3e3e42',
  '--border-secondary': '#2b2b2b',
  '--focus-border': '#007fd4',

  // Accent
  '--accent': '#0e639c',
  '--accent-fg': '#ffffff',
  '--accent-hover': '#1177bb',
  '--btn-secondary-bg': '#3a3d41',
  '--btn-secondary-fg': '#cccccc',
  '--btn-secondary-hover': '#45494e',

  // Badge
  '--badge-bg': '#4d4d4d',
  '--badge-fg': '#ffffff',
  '--activitybar-badge-bg': '#007acc',
  '--activitybar-badge-fg': '#ffffff',

  // Layout foregrounds
  '--activitybar-fg': '#ffffff',
  '--sidebar-fg': '#cccccc',
  '--statusbar-fg': '#ffffff',
  '--titlebar-fg': '#cccccc',

  // Tabs
  '--tab-active-bg': '#1e1e1e',
  '--tab-active-fg': '#ffffff',
  '--tab-inactive-bg': '#2d2d2d',
  '--tab-inactive-fg': '#969696',
};

export const LIGHT_DEFAULTS: Record<string, string> = {
  // Layout
  '--app-bg': '#ffffff',
  '--sidebar-bg': '#f3f3f3',
  '--activitybar-bg': '#e8e8e8',
  '--panel-bg': '#ffffff',
  '--statusbar-bg': '#f5f5f5',
  '--titlebar-bg': '#dddddd',
  '--widget-bg': '#f3f3f3',
  '--input-bg': '#ffffff',
  '--input-fg': '#616161',
  '--input-border': '#cecece',

  // Interactive
  '--hover-bg': '#e8e8e8',
  '--selection-bg': '#0060c0',
  '--selection-fg': '#ffffff',
  '--active-bg': '#e4e6f1',

  // Text
  '--text-primary': '#616161',
  '--text-secondary': '#717171',
  '--text-muted': '#a0a0a0',
  '--text-heading': '#333333',

  // Borders
  '--border-color': '#cecece',
  '--border-secondary': '#e8e8e8',
  '--focus-border': '#0090f1',

  // Accent
  '--accent': '#007acc',
  '--accent-fg': '#ffffff',
  '--accent-hover': '#0062a3',
  '--btn-secondary-bg': '#5f6a79',
  '--btn-secondary-fg': '#ffffff',
  '--btn-secondary-hover': '#4c5561',

  // Badge
  '--badge-bg': '#c4c4c4',
  '--badge-fg': '#333333',
  '--activitybar-badge-bg': '#007acc',
  '--activitybar-badge-fg': '#ffffff',

  // Layout foregrounds
  '--activitybar-fg': '#424242',
  '--sidebar-fg': '#616161',
  '--statusbar-fg': '#424242',
  '--titlebar-fg': '#333333',

  // Tabs
  '--tab-active-bg': '#ffffff',
  '--tab-active-fg': '#333333',
  '--tab-inactive-bg': '#ececec',
  '--tab-inactive-fg': '#717171',
};

/**
 * Default --vscode-* variables for vscode-elements web components.
 */
export const VSCODE_ELEMENT_DEFAULTS: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    '--vscode-font-family': 'Inter, system-ui, sans-serif',
    '--vscode-font-size': '13px',
    '--vscode-foreground': '#cccccc',
    '--vscode-focusBorder': '#007acc',
    '--vscode-input-background': '#3c3c3c',
    '--vscode-input-foreground': '#cccccc',
    '--vscode-input-border': '#3e3e42',
    '--vscode-inputOption-activeBorder': '#007acc',
    '--vscode-button-background': '#0e639c',
    '--vscode-button-foreground': '#ffffff',
    '--vscode-button-hoverBackground': '#1177bb',
    '--vscode-button-secondaryBackground': '#3a3d41',
    '--vscode-button-secondaryForeground': '#cccccc',
    '--vscode-button-secondaryHoverBackground': '#45494e',
    '--vscode-checkbox-background': '#3c3c3c',
    '--vscode-checkbox-border': '#3e3e42',
    '--vscode-checkbox-foreground': '#cccccc',
    '--vscode-badge-background': '#4d4d4d',
    '--vscode-badge-foreground': '#ffffff',
    '--vscode-list-hoverBackground': '#2a2d2e',
    '--vscode-scrollbar-shadow': '#000000',
    '--vscode-scrollbarSlider-background': 'rgba(121, 121, 121, 0.4)',
    '--vscode-scrollbarSlider-hoverBackground': 'rgba(100, 100, 100, 0.7)',
    '--vscode-scrollbarSlider-activeBackground': 'rgba(191, 191, 191, 0.4)',
  },
  light: {
    '--vscode-font-family': 'Inter, system-ui, sans-serif',
    '--vscode-font-size': '13px',
    '--vscode-foreground': '#616161',
    '--vscode-focusBorder': '#0090f1',
    '--vscode-input-background': '#ffffff',
    '--vscode-input-foreground': '#616161',
    '--vscode-input-border': '#cecece',
    '--vscode-inputOption-activeBorder': '#007acc',
    '--vscode-button-background': '#007acc',
    '--vscode-button-foreground': '#ffffff',
    '--vscode-button-hoverBackground': '#0062a3',
    '--vscode-button-secondaryBackground': '#5f6a79',
    '--vscode-button-secondaryForeground': '#ffffff',
    '--vscode-button-secondaryHoverBackground': '#4c5561',
    '--vscode-checkbox-background': '#ffffff',
    '--vscode-checkbox-border': '#cecece',
    '--vscode-checkbox-foreground': '#616161',
    '--vscode-badge-background': '#c4c4c4',
    '--vscode-badge-foreground': '#333333',
    '--vscode-list-hoverBackground': '#e8e8e8',
    '--vscode-scrollbar-shadow': '#dddddd',
    '--vscode-scrollbarSlider-background': 'rgba(100, 100, 100, 0.4)',
    '--vscode-scrollbarSlider-hoverBackground': 'rgba(100, 100, 100, 0.7)',
    '--vscode-scrollbarSlider-activeBackground': 'rgba(0, 0, 0, 0.6)',
  },
};
