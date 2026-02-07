import { WorkspaceDefinition } from '../../types/workspace';

interface SidebarProps {
  workspace: WorkspaceDefinition;
}

export function Sidebar({ workspace }: SidebarProps) {
  const sidebarConfig = workspace.sidebarConfig;

  if (!sidebarConfig || !sidebarConfig.enabled) {
    return null;
  }

  const SidebarContent = sidebarConfig.component;
  return <SidebarContent />;
}
