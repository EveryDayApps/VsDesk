import { Reorder } from 'framer-motion';
import {
    Bookmark,
    Files,
    GitGraph,
    LayoutGrid,
    LucideIcon,
    Play,
    Search,
    Settings,
    User,
} from 'lucide-react';
import { useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { cn } from '../../utils/cn';

interface ActivityBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
}

const TAB_MAP: Record<string, { icon: LucideIcon; label: string }> = {
  explorer: { icon: Files, label: 'Explorer' },
  search: { icon: Search, label: 'Search' },
  git: { icon: GitGraph, label: 'Source Control' },
  debug: { icon: Play, label: 'Run and Debug' },
  extensions: { icon: LayoutGrid, label: 'Extensions' },
  bookmark: { icon: Bookmark, label: 'Bookmarks' },
};

const DEFAULT_TAB_ORDER = ['explorer', 'search', 'git', 'debug', 'extensions', 'bookmark'];

export function ActivityBar({ activeTab, onTabChange, onSettingsClick }: ActivityBarProps) {
  const [tabOrder, setTabOrder] = useLocalStorage<string[]>('vsdesk-activity-bar-order', DEFAULT_TAB_ORDER);

  // Sync: ensure any new tabs from DEFAULT_TAB_ORDER are included
  const syncedOrder = useMemo(() => {
    const missing = DEFAULT_TAB_ORDER.filter((id) => !tabOrder.includes(id));
    const valid = tabOrder.filter((id) => TAB_MAP[id]);
    return missing.length > 0 ? [...valid, ...missing] : valid;
  }, [tabOrder]);

  const handleReorder = (newOrder: string[]) => {
    setTabOrder(newOrder);
  };

  return (
    <div className="flex flex-col justify-between w-12 bg-vscode-activityBar border-r border-vscode-sidebar h-full text-vscode-text select-none z-20">
      <Reorder.Group
        axis="y"
        values={syncedOrder}
        onReorder={handleReorder}
        className="flex flex-col items-center pt-2 list-none m-0 p-0"
      >
        {syncedOrder.map((tabId) => {
          const tab = TAB_MAP[tabId];
          if (!tab) return null;
          const Icon = tab.icon;
          return (
            <Reorder.Item
              key={tabId}
              value={tabId}
              dragConstraints={{ left: 0, right: 0 }}
              whileDrag={{ scale: 1.1, opacity: 0.8 }}
              className={cn(
                'group relative flex items-center justify-center w-12 h-12 transition-colors hover:text-white cursor-grab active:cursor-grabbing',
                activeTab === tabId ? 'text-white' : 'text-vscode-text opacity-60 hover:opacity-100'
              )}
              title={tab.label}
              onClick={() => onTabChange(tabId)}
            >
              {activeTab === tabId && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-vscode-white" />
              )}
              <Icon className="w-6 h-6 stroke-1 pointer-events-none" />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div className="flex flex-col items-center pb-2">
        <button
          className="group flex items-center justify-center w-12 h-12 text-vscode-text opacity-60 hover:text-white hover:opacity-100 transition-colors"
          title="Accounts"
        >
          <User className="w-6 h-6 stroke-1" />
        </button>
        <button
          onClick={onSettingsClick}
          className="group flex items-center justify-center w-12 h-12 text-vscode-text opacity-60 hover:text-white hover:opacity-100 transition-colors"
          title="Manage"
        >
          <Settings className="w-6 h-6 stroke-1" />
        </button>
      </div>
    </div>
  );
}
