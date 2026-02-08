import { useEffect, useState } from 'react';
import { ActivityBar } from './components/layout/ActivityBar';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { TitleBar } from './components/layout/TitleBar';
import { CommandPalette } from './components/widgets/CommandPalette';
import { useSettings } from './context/SettingsContext';
import { useWorkspace } from './context/WorkspaceContext';
import { useTheme } from './hooks/useTheme';

function App() {
  const { activeTheme, themes, setTheme } = useTheme();
  const { settings } = useSettings();
  const { activeWorkspace, activeWorkspaceId, setActiveWorkspace } = useWorkspace();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleWorkspaceChange = (workspaceId: string) => {
    if (activeWorkspaceId === workspaceId) {
      toggleSidebar();
    } else {
      setActiveWorkspace(workspaceId);
      if (!isSidebarOpen && activeWorkspace.sidebarConfig?.enabled) {
        setIsSidebarOpen(true);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const ActiveComponent = activeWorkspace.component;
  const showSidebar = settings.showSidebar && isSidebarOpen && activeWorkspace.sidebarConfig?.enabled;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-vscode-bg text-[var(--text-heading)] font-sans">
      {settings.showTitleBar && <TitleBar onSearchClick={() => setShowCommandPalette(true)} />}

      <div className="flex flex-1 overflow-hidden relative">
        {settings.showActivityBar && (
          <ActivityBar
            activeWorkspaceId={activeWorkspaceId}
            onWorkspaceChange={handleWorkspaceChange}
          />
        )}

        {showSidebar && (
          <Sidebar workspace={activeWorkspace} />
        )}

        <main className="flex-1 overflow-hidden relative bg-vscode-bg">
          <ActiveComponent />
        </main>
      </div>

      {settings.showStatusBar && <StatusBar />}

      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          activeTheme={activeTheme}
          themes={themes}
          onSetTheme={setTheme}
          onOpenSettings={() => setActiveWorkspace('settings')}
        />
      )}
    </div>
  );
}

export default App;
