import { useEffect, useState } from 'react';
import { ActivityBar } from './components/layout/ActivityBar';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { TitleBar } from './components/layout/TitleBar';
import { Clock } from './components/widgets/Clock';
import { CommandPalette } from './components/widgets/CommandPalette'; // Missing Import previously? checked above, yes
import { GoogleSearch } from './components/widgets/GoogleSearch';
import { Notes } from './components/widgets/Notes';
import { QuickLinks } from './components/widgets/QuickLinks';
import { TodoList } from './components/widgets/TodoList';
import { useTheme } from './hooks/useTheme';

function App() {
  const { toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('explorer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabChange = (tab: string) => {
    if (activeTab === tab) {
      toggleSidebar();
    } else {
      setActiveTab(tab);
      if (!isSidebarOpen) setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-vscode-bg text-white font-sans selection:bg-vscode-selection">
      <TitleBar onSearchClick={() => setShowCommandPalette(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        <ActivityBar activeTab={activeTab} onTabChange={handleTabChange} />

        {isSidebarOpen && (
          <Sidebar activeTab={activeTab} />
        )}

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Top Section: Clock & Search */}
            <div className="flex flex-col items-center justify-center pt-8 md:pt-16 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Clock />
              <GoogleSearch />
            </div>

            {/* Quick Links Grid */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              <h3 className="text-sm font-semibold text-vscode-text mb-4 uppercase tracking-wider px-4">
                Quick Access
              </h3>
              <QuickLinks />
            </div>

            {/* Widgets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 px-4">
              <div className="h-96">
                <Notes />
              </div>
              <div className="h-96">
                <TodoList />
              </div>
            </div>
            
            {/* Footer / Info */}
            <div className="text-center text-xs text-vscode-text opacity-40 pt-12 pb-4">
              <p>Pro Tip: Press Cmd+K / Ctrl+K to open the Command Palette</p>
            </div>
          </div>
        </main>
      </div>

      <StatusBar />

      {/* Overlays */}
      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

export default App;
