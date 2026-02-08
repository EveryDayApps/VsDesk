import { Reorder } from 'framer-motion';
import { useMemo } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { cn } from '../../utils/cn';

interface ActivityBarProps {
  activeWorkspaceId: string;
  onWorkspaceChange: (id: string) => void;
}

export function ActivityBar({ activeWorkspaceId, onWorkspaceChange }: ActivityBarProps) {
  const { workspaces } = useWorkspace();

  const topWorkspaces = workspaces.filter((w) => w.position !== 'bottom');
  const bottomWorkspaces = workspaces.filter((w) => w.position === 'bottom');

  const defaultOrder = topWorkspaces.map((w) => w.id);
  const [tabOrder, setTabOrder] = useLocalStorage<string[]>('vsdesk-activity-bar-order', defaultOrder);

  const syncedOrder = useMemo(() => {
    const topIds = new Set(topWorkspaces.map((w) => w.id));
    const valid = tabOrder.filter((id) => topIds.has(id));
    const missing = defaultOrder.filter((id) => !tabOrder.includes(id));
    return missing.length > 0 ? [...valid, ...missing] : valid;
  }, [tabOrder, topWorkspaces, defaultOrder]);

  const handleReorder = (newOrder: string[]) => {
    setTabOrder(newOrder);
  };

  return (
    <div className="relative flex flex-col justify-between w-12 border-r h-full select-none z-20" style={{ backgroundColor: 'var(--activitybar-bg)', borderColor: 'var(--border-color)', color: 'var(--activitybar-fg)' }}>
      <Reorder.Group
        axis="y"
        values={syncedOrder}
        onReorder={handleReorder}
        className="flex flex-col items-center pt-2 list-none m-0 p-0"
      >
        {syncedOrder.map((workspaceId) => {
          const workspace = workspaces.find((w) => w.id === workspaceId);
          if (!workspace || workspace.position === 'bottom') return null;
          const Icon = workspace.icon;
          return (
            <Reorder.Item
              key={workspaceId}
              value={workspaceId}
              dragConstraints={{ left: 0, right: 0 }}
              whileDrag={{ scale: 1.1, opacity: 0.8 }}
              className={cn(
                'group relative flex items-center justify-center w-12 h-12 transition-colors hover:text-white cursor-grab active:cursor-grabbing',
                activeWorkspaceId === workspaceId ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              )}
              title={workspace.title}
              onClick={() => onWorkspaceChange(workspaceId)}
            >
              {activeWorkspaceId === workspaceId && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--activitybar-fg)]" />
              )}
              <Icon className="w-6 h-6 stroke-1 pointer-events-none" />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div className="flex flex-col items-center pb-2 relative">
        {bottomWorkspaces.map((workspace) => {
          const Icon = workspace.icon;
          return (
            <button
              key={workspace.id}
              onClick={() => onWorkspaceChange(workspace.id)}
              className={cn(
                'group flex items-center justify-center w-12 h-12 transition-colors',
                activeWorkspaceId === workspace.id
                  ? 'text-[var(--activitybar-fg)]'
                  : 'opacity-60 hover:opacity-100'
              )}
              title={workspace.title}
            >
              <Icon className="w-6 h-6 stroke-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
