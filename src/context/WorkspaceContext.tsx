import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WorkspaceDefinition } from '../types/workspace';

interface WorkspaceContextType {
  workspaces: WorkspaceDefinition[];
  activeWorkspaceId: string;
  setActiveWorkspace: (id: string) => void;
  activeWorkspace: WorkspaceDefinition;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const DEFAULT_WORKSPACE_ID = 'home';

interface WorkspaceProviderProps {
  children: ReactNode;
  workspaces: WorkspaceDefinition[];
}

export function WorkspaceProvider({ children, workspaces }: WorkspaceProviderProps) {
  const [activeWorkspaceId, setActiveWorkspaceId] = useLocalStorage<string>(
    'vsdesk-active-workspace',
    DEFAULT_WORKSPACE_ID
  );

  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0],
    [activeWorkspaceId, workspaces]
  );

  const setActiveWorkspace = useCallback(
    (id: string) => {
      if (workspaces.some((w) => w.id === id)) {
        setActiveWorkspaceId(id);
      }
    },
    [workspaces, setActiveWorkspaceId]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        const target = workspaces.find((w) => w.shortcutIndex === num);
        if (target) {
          e.preventDefault();
          setActiveWorkspaceId(target.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [workspaces, setActiveWorkspaceId]);

  return (
    <WorkspaceContext.Provider
      value={{ workspaces, activeWorkspaceId, setActiveWorkspace, activeWorkspace }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
