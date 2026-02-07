import {
    Files,
    GitGraph,
    LayoutGrid,
    Play,
    Search,
    Settings,
    User,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ActivityBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'explorer', icon: Files, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'git', icon: GitGraph, label: 'Source Control' },
  { id: 'debug', icon: Play, label: 'Run and Debug' },
  { id: 'extensions', icon: LayoutGrid, label: 'Extensions' },
];

export function ActivityBar({ activeTab, onTabChange }: ActivityBarProps) {
  return (
    <div className="flex flex-col justify-between w-12 bg-vscode-activityBar border-r border-vscode-sidebar h-full text-vscode-text select-none z-20">
      <div className="flex flex-col items-center pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'group relative flex items-center justify-center w-12 h-12 transition-colors hover:text-white',
              activeTab === tab.id ? 'text-white' : 'text-vscode-text opacity-60 hover:opacity-100'
            )}
            title={tab.label}
          >
            {activeTab === tab.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-vscode-white" />
            )}
            <tab.icon className="w-6 h-6 stroke-1" />
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center pb-2">
        <button
          className="group flex items-center justify-center w-12 h-12 text-vscode-text opacity-60 hover:text-white hover:opacity-100 transition-colors"
          title="Accounts"
        >
          <User className="w-6 h-6 stroke-1" />
        </button>
        <button
          className="group flex items-center justify-center w-12 h-12 text-vscode-text opacity-60 hover:text-white hover:opacity-100 transition-colors"
          title="Manage"
        >
          <Settings className="w-6 h-6 stroke-1" />
        </button>
      </div>
    </div>
  );
}
