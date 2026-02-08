/**
 * Maps VS Code theme color keys → App CSS variable names.
 * These are the design system tokens used by our UI via Tailwind.
 */
export const APP_TOKEN_MAP: Record<string, string> = {
  // Layout backgrounds
  'editor.background': '--app-bg',
  'sideBar.background': '--sidebar-bg',
  'activityBar.background': '--activitybar-bg',
  'panel.background': '--panel-bg',
  'statusBar.background': '--statusbar-bg',
  'titleBar.activeBackground': '--titlebar-bg',
  'editorWidget.background': '--widget-bg',
  'input.background': '--input-bg',

  // Layout foregrounds
  'activityBar.foreground': '--activitybar-fg',
  'sideBar.foreground': '--sidebar-fg',
  'statusBar.foreground': '--statusbar-fg',
  'titleBar.activeForeground': '--titlebar-fg',
  'input.foreground': '--input-fg',
  'input.border': '--input-border',
  'editor.foreground': '--text-heading',

  // Interactive states
  'list.hoverBackground': '--hover-bg',
  'list.activeSelectionBackground': '--selection-bg',
  'list.activeSelectionForeground': '--selection-fg',
  'list.inactiveSelectionBackground': '--active-bg',

  // Text
  'foreground': '--text-primary',
  'descriptionForeground': '--text-secondary',
  'disabledForeground': '--text-muted',

  // Borders
  'focusBorder': '--focus-border',
  'panel.border': '--border-color',
  'widget.border': '--border-secondary',

  // Accent / Buttons
  'button.background': '--accent',
  'button.foreground': '--accent-fg',
  'button.hoverBackground': '--accent-hover',
  'button.secondaryBackground': '--btn-secondary-bg',
  'button.secondaryForeground': '--btn-secondary-fg',
  'button.secondaryHoverBackground': '--btn-secondary-hover',

  // Badge
  'badge.background': '--badge-bg',
  'badge.foreground': '--badge-fg',
  'activityBarBadge.background': '--activitybar-badge-bg',
  'activityBarBadge.foreground': '--activitybar-badge-fg',

  // Tabs
  'tab.activeBackground': '--tab-active-bg',
  'tab.activeForeground': '--tab-active-fg',
  'tab.inactiveBackground': '--tab-inactive-bg',
  'tab.inactiveForeground': '--tab-inactive-fg',
};

/**
 * Maps VS Code theme color keys → --vscode-* CSS variables
 * consumed by @vscode-elements/elements web components.
 */
export const VSCODE_ELEMENT_MAP: Record<string, string> = {
  'foreground': '--vscode-foreground',
  'focusBorder': '--vscode-focusBorder',
  'input.background': '--vscode-input-background',
  'input.foreground': '--vscode-input-foreground',
  'input.border': '--vscode-input-border',
  'inputOption.activeBorder': '--vscode-inputOption-activeBorder',
  'button.background': '--vscode-button-background',
  'button.foreground': '--vscode-button-foreground',
  'button.hoverBackground': '--vscode-button-hoverBackground',
  'button.secondaryBackground': '--vscode-button-secondaryBackground',
  'button.secondaryForeground': '--vscode-button-secondaryForeground',
  'button.secondaryHoverBackground': '--vscode-button-secondaryHoverBackground',
  'checkbox.background': '--vscode-checkbox-background',
  'checkbox.border': '--vscode-checkbox-border',
  'checkbox.foreground': '--vscode-checkbox-foreground',
  'badge.background': '--vscode-badge-background',
  'badge.foreground': '--vscode-badge-foreground',
  'list.hoverBackground': '--vscode-list-hoverBackground',
  'scrollbar.shadow': '--vscode-scrollbar-shadow',
  'scrollbarSlider.background': '--vscode-scrollbarSlider-background',
  'scrollbarSlider.hoverBackground': '--vscode-scrollbarSlider-hoverBackground',
  'scrollbarSlider.activeBackground': '--vscode-scrollbarSlider-activeBackground',
};

/**
 * Fallback border resolution order.
 * If --border-color isn't set by the primary token map,
 * try these VS Code keys in order.
 */
export const BORDER_FALLBACK_KEYS = [
  'panel.border',
  'sideBar.border',
  'editorGroup.border',
  'widget.border',
  'input.border',
];
