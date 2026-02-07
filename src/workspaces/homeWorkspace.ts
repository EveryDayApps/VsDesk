import { Home } from 'lucide-react';
import { WorkspaceDefinition } from '../types/workspace';
import { HomeView } from './views/HomeView';
import { ExplorerSidebar } from './sidebars/ExplorerSidebar';

export const homeWorkspace: WorkspaceDefinition = {
  id: 'home',
  title: 'Home',
  icon: Home,
  component: HomeView,
  sidebarConfig: {
    component: ExplorerSidebar,
    title: 'Explorer',
    enabled: true,
  },
  shortcutIndex: 1,
  position: 'top',
};
