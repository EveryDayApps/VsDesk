import {
    Github,
    Monitor,
    Moon,
    Search,
    Settings,
    Trash2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void;
  onOpenSettings: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette({ isOpen, onClose, toggleTheme, onOpenSettings }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<any>(null);

  const commands: CommandItem[] = [
    {
      id: 'theme-toggle',
      label: 'Toggle Theme',
      subLabel: 'Switch between light and dark mode',
      icon: Moon, // Or Sun based on current theme, simplified
      action: toggleTheme,
      shortcut: '⌘T',
    },
    {
      id: 'new-file',
      label: 'New File',
      subLabel: 'Create a new text file',
      icon: Monitor,
      action: () => alert('New File created! (Mock)'),
      shortcut: '⌘N',
    },
    {
      id: 'open-settings',
      label: 'Open Settings',
      subLabel: 'Preferences: Open User Settings',
      icon: Settings,
      action: onOpenSettings,
      shortcut: '⌘,',
    },
    {
      id: 'clear-storage',
      label: 'Clear All Data',
      subLabel: 'Reset Notes and Todos',
      icon: Trash2,
      action: () => {
        if (confirm('Are you sure you want to clear all data?')) {
          localStorage.clear();
          window.location.reload();
        }
      },
    },
    {
      id: 'github',
      label: 'Open GitHub',
      subLabel: 'External Link',
      icon: Github,
      action: () => window.open('https://github.com', '_blank'),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    (cmd.subLabel && cmd.subLabel.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose(); // Close after action
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-vscode-sidebar border border-vscode-focusBorder shadow-2xl rounded-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-vscode-border bg-vscode-input">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <vscode-textfield
            ref={inputRef}
            className="flex-1"
            placeholder="Type a command or search..."
            value={query}
            onInput={(e: any) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <vscode-badge className="ml-2">ESC</vscode-badge>
        </div>
        
        <vscode-scrollable className="max-h-[60vh] py-2">
          {filteredCommands.length === 0 ? (
             <div className="px-4 py-8 text-center text-gray-500">
               No commands found.
             </div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={cn(
                  "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group",
                  index === selectedIndex
                    ? "bg-vscode-blue/20 border-l-2 border-vscode-blue"
                    : "hover:bg-vscode-list-hover border-l-2 border-transparent"
                )}
                onClick={() => {
                  command.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start">
                  <command.icon className={cn(
                    "w-5 h-5 mt-0.5 mr-3 transition-colors",
                    index === selectedIndex ? "text-white" : "text-gray-400"
                  )} />
                  <div>
                    <div className={cn(
                      "text-sm font-medium transition-colors",
                      index === selectedIndex ? "text-white" : "text-gray-300"
                    )}>
                      {command.label}
                    </div>
                    {command.subLabel && (
                       <div className="text-xs text-gray-500 mt-0.5">
                         {command.subLabel}
                       </div>
                    )}
                  </div>
                </div>
                {command.shortcut && (
                  <vscode-badge>{command.shortcut}</vscode-badge>
                )}
              </div>
            ))
          )}
        </vscode-scrollable>
        
        <div className="bg-vscode-statusBar px-4 py-1.5 text-xs text-vscode-text flex justify-between border-t border-vscode-border">
            <span>ProTip: Use arrow keys to navigate</span>
            <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
