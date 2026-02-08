import {
    LayoutTemplate,
    Maximize2,
    Minimize2,
    Search,
    X
} from 'lucide-react';

interface TitleBarProps {
  onSearchClick: () => void;
}

export function TitleBar({ onSearchClick }: TitleBarProps) {
  return (
    <div className="h-9 min-h-[2.25rem] w-full flex items-center justify-between px-2 text-sm select-none border-b" style={{ backgroundColor: 'var(--titlebar-bg)', color: 'var(--titlebar-fg)', borderColor: 'var(--border-color)' }}>
      {/* Left Section: Menu + Nav */}
      <div className="flex items-center space-x-3 w-1/3">
        <div className="mr-2">
          <img
            src="/vite.svg" 
            alt="Logo"
            className="w-4 h-4"
          />
        </div>
        <div className="hidden md:flex space-x-3 text-xs text-vscode-text">
          <span className="hover:bg-vscode-list-hover px-1 rounded cursor-pointer transition-colors">File</span>
          <span className="hover:bg-vscode-list-hover px-1 rounded cursor-pointer transition-colors">Edit</span>
          <span className="hover:bg-vscode-list-hover px-1 rounded cursor-pointer transition-colors">Selection</span>
          <span className="hover:bg-vscode-list-hover px-1 rounded cursor-pointer transition-colors">View</span>
          <span className="hover:bg-vscode-list-hover px-1 rounded cursor-pointer transition-colors">Go</span>
          <span className="hover:bg-vscode-list-hover px-1 rounded cursor-pointer transition-colors">Run</span>
          <span className="hover:bg-vscode-list-hover px-1 rounded cursor-pointer transition-colors">Terminal</span>
          <span className="hover:bg-vscode-list-hover px-1 rounded cursor-pointer transition-colors">Help</span>
        </div>
      </div>

      {/* Center Section: Search / Command Palette Trigger */}
      <div className="flex-1 flex justify-center max-w-xl">
        <vscode-button
          onClick={onSearchClick}
          appearance="secondary"
          className="flex items-center justify-center space-x-2 w-full max-w-md"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs truncate">vshome — browser-start</span>
        </vscode-button>
      </div>

      {/* Right Section: Window Controls */}
      <div className="flex items-center justify-end space-x-3 w-1/3">
        <div className="flex space-x-2 mr-2">
           <LayoutTemplate className="w-4 h-4 text-vscode-text hover:text-[var(--titlebar-fg)] cursor-pointer transition-colors" />
        </div>
        <div className="flex items-center space-x-4 pl-4 border-l border-vscode-sidebar">
          <Minimize2 className="w-3 h-3 hover:text-[var(--titlebar-fg)] cursor-pointer transition-colors" />
          <Maximize2 className="w-3 h-3 hover:text-[var(--titlebar-fg)] cursor-pointer transition-colors" />
          <X className="w-3 h-3 hover:text-[var(--text-error)] cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
}
