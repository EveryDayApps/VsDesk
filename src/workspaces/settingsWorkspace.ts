import { Settings } from 'lucide-react';
import { WorkspaceDefinition } from '../types/workspace';
import { SettingsView } from './views/SettingsView';

export const settingsWorkspace: WorkspaceDefinition = {
  id: 'settings',
  title: 'Settings',
  icon: Settings,
  component: SettingsView,
  sidebarConfig: null,
  shortcutIndex: 9,
  position: 'bottom',
};
