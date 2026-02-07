import {
    ChevronDown,
    ChevronRight,
    Clock,
    ExternalLink,
    FileText,
    Folder,
    Layout,
    Pin,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  activeTab: string;
}

interface TreeItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: TreeItem[];
  collapsed?: boolean;
}

const initialTree: TreeItem[] = [
  {
    id: 'favs',
    label: 'FAVORITES',
    collapsed: false,
    children: [
      { id: 'f1', label: 'GitHub Dashboard', icon: Pin },
      { id: 'f2', label: 'Project Roadmap', icon: FileText },
    ],
  },
  {
    id: 'recent',
    label: 'RECENT',
    collapsed: false,
    children: [
      { id: 'r1', label: 'Today\'s Standup', icon: Clock },
      { id: 'r2', label: 'React Documentation', icon: ExternalLink },
    ],
  },
  {
    id: 'workspace',
    label: 'WORKSPACE',
    collapsed: false,
    children: [
      { id: 'w1', label: 'Personal', icon: Folder, collapsed: true, children: [
        { id: 'w1-1', label: 'Finances.md', icon: FileText },
        { id: 'w1-2', label: 'Ideas.md', icon: FileText },
      ]},
      { id: 'w2', label: 'Work', icon: Folder, collapsed: false, children: [
        { id: 'w2-1', label: 'Q3_Goals.md', icon: FileText },
      ]},
    ],
  },
];

export function Sidebar({ activeTab }: SidebarProps) {
  const [treeStructure, setTreeStructure] = useState(initialTree);

  // Toggle collapse state
  const toggleCollapse = (id: string, items: TreeItem[]): TreeItem[] => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, collapsed: !item.collapsed };
      }
      if (item.children) {
        return { ...item, children: toggleCollapse(id, item.children) };
      }
      return item;
    });
  };

  const handleToggle = (id: string) => {
    setTreeStructure((prev) => toggleCollapse(id, prev));
  };

  if (activeTab !== 'explorer') {
    return (
      <div className="w-64 bg-vscode-sidebar border-r border-vscode-sidebar flex flex-col items-center justify-center text-vscode-text opacity-50 text-sm">
        <p>No view implementation for {activeTab}</p>
      </div>
    );
  }

  const renderTree = (items: TreeItem[], depth = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isHeader = depth === 0;

      return (
        <div key={item.id}>
          <div
            className={cn(
              'flex items-center px-4 py-1 cursor-pointer select-none transition-colors overflow-hidden truncate',
              isHeader
                ? 'font-bold text-xs text-vscode-text tracking-wide mt-2 hover:text-white'
                : 'text-sm text-gray-400 hover:bg-vscode-list-hover hover:text-white',
              !isHeader && 'ml-2'
            )}
            style={{ paddingLeft: `${depth * 12 + (isHeader ? 16 : 8)}px` }}
            onClick={() => hasChildren && handleToggle(item.id)}
          >
            {hasChildren && (
              <span className="mr-1">
                {item.collapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </span>
            )}
            {item.icon && !isHeader && <item.icon className="w-4 h-4 mr-2" />}
            <span>{item.label}</span>
          </div>
          {hasChildren && !item.collapsed && (
            <div>{renderTree(item.children || [], depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-64 bg-vscode-sidebar border-r border-gray-800 flex flex-col h-full pt-2">
      <div className="px-5 mb-2 flex items-center justify-between text-xs text-vscode-text uppercase tracking-wider font-semibold">
        <span>Explorer</span>
        <Layout className="w-4 h-4 cursor-pointer hover:text-white" />
      </div>
      <vscode-scrollable className="flex-1">
        {renderTree(treeStructure)}
      </vscode-scrollable>
    </div>
  );
}
