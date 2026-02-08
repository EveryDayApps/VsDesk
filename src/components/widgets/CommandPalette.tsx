import {
  Github,
  Monitor,
  Palette,
  Search,
  Settings,
  Trash2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Theme } from '../../theme/types';
import { cn } from '../../utils/cn';
import { Overlay } from '../ui/Overlay';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: Theme | null;
  themes: Theme[];
  onSetTheme: (id: string) => Promise<void>;
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

export function CommandPalette({ isOpen, onClose, activeTheme, themes, onSetTheme, onOpenSettings }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<any>(null);

  const themeCommands: CommandItem[] = themes.map((theme) => ({
    id: `theme-${theme.id}`,
    label: `Color Theme: ${theme.name}`,
    subLabel: activeTheme?.id === theme.id ? 'Active' : `${theme.base} theme${theme.type === 'imported' ? ' (imported)' : ''}`,
    icon: Palette,
    action: () => onSetTheme(theme.id),
  }));

  const commands: CommandItem[] = [
    ...themeCommands,
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
          onClose();
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
    <Overlay onClose={onClose} className="flex items-start justify-center pt-[15vh]">
      <div
        className="w-full max-w-2xl bg-[var(--sidebar-bg)] border border-[var(--focus-border)] shadow-2xl rounded-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-[var(--border-color)] bg-[var(--input-bg)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] mr-3" />
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
             <div className="px-4 py-8 text-center text-[var(--text-muted)]">
               No commands found.
             </div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={cn(
                  "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group",
                  index === selectedIndex
                    ? "bg-[var(--selection-bg)] border-l-2 border-[var(--accent)]"
                    : "hover:bg-[var(--hover-bg)] border-l-2 border-transparent"
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
                    index === selectedIndex ? "text-[var(--selection-fg)]" : "text-[var(--text-muted)]"
                  )} />
                  <div>
                    <div className={cn(
                      "text-sm font-medium transition-colors",
                      index === selectedIndex ? "text-[var(--selection-fg)]" : "text-[var(--text-heading)]"
                    )}>
                      {command.label}
                    </div>
                    {command.subLabel && (
                       <div className="text-xs text-[var(--text-muted)] mt-0.5">
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

        <div className="bg-[var(--statusbar-bg)] text-[var(--statusbar-fg)] px-4 py-1.5 text-xs flex justify-between border-t border-[var(--border-color)]">
            <span>ProTip: Use arrow keys to navigate</span>
            <span>v1.0.0</span>
        </div>
      </div>
    </Overlay>
  );
}
