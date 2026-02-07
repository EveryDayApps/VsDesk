import {
    AlertTriangle,
    Bell,
    GitBranch,
    Radio,
    RefreshCw,
    XCircle
} from 'lucide-react';

export function StatusBar() {
  return (
    <footer className="h-6 min-h-[1.5rem] bg-vscode-statusBar text-white flex items-center justify-between px-2 text-xs select-none">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer transition-colors">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="flex items-center space-x-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer transition-colors">
          <RefreshCw className="w-3 h-3" />
        </div>
        <div className="flex items-center space-x-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer transition-colors">
          <XCircle className="w-3 h-3" />
          <span>0</span>
          <AlertTriangle className="w-3 h-3 ml-1" />
          <span>0</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer transition-colors hidden sm:flex">
          <Radio className="w-3 h-3" />
          <span>Go Live</span>
        </div>
        <div className="flex items-center space-x-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer transition-colors">
          <span className="mr-2">Ln 12, Col 45</span>
          <span>UTF-8</span>
          <span>TSX</span>
        </div>
        <div className="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer transition-colors">
          <Bell className="w-3 h-3" />
        </div>
      </div>
    </footer>
  );
}
