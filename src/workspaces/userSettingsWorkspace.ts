import { User } from 'lucide-react';
import { UserSettingsView } from '../components/user/UserSettingsView';
import { WorkspaceDefinition } from '../types/workspace';

export const userSettingsWorkspace: WorkspaceDefinition = {
  id: 'user-settings',
  title: 'User',
  icon: User,
  component: UserSettingsView,
  sidebarConfig: null,
  position: 'bottom',
};
