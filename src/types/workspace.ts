import { type ComponentType } from 'react';
import { type LucideIcon } from 'lucide-react';

export interface WorkspaceSidebarConfig {
  component: ComponentType;
  title: string;
  enabled: boolean;
}

export interface WorkspaceDefinition {
  id: string;
  title: string;
  icon: LucideIcon;
  component: ComponentType;
  sidebarConfig: WorkspaceSidebarConfig | null;
  shortcutIndex?: number;
  position?: 'top' | 'bottom';
}
