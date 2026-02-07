import { Clock } from '../../components/widgets/Clock';
import { GoogleSearch } from '../../components/widgets/GoogleSearch';
import { Notes } from '../../components/widgets/Notes';
import { QuickLinks } from '../../components/widgets/QuickLinks';
import { TodoList } from '../../components/widgets/TodoList';
import { useSettings } from '../../context/SettingsContext';

export function HomeView() {
  const { settings } = useSettings();

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Top Section: Clock & Search */}
        <div className="flex flex-col items-center justify-center pt-8 md:pt-16 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {settings.showClock && <Clock />}
          {settings.showGoogleSearch && <GoogleSearch />}
        </div>

        {/* Quick Links Grid */}
        {settings.showQuickLinks && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <h3 className="text-sm font-semibold text-vscode-text mb-4 uppercase tracking-wider px-4">
              Quick Access
            </h3>
            <QuickLinks />
          </div>
        )}

        {/* Widgets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 px-4">
          {settings.showNotes && (
            <div className="h-96">
              <Notes />
            </div>
          )}
          {settings.showTodoList && (
            <div className="h-96">
              <TodoList />
            </div>
          )}
        </div>

        {/* Footer / Info */}
        <div className="text-center text-xs text-vscode-text opacity-40 pt-12 pb-4">
          <p>Pro Tip: Press Cmd+K / Ctrl+K to open the Command Palette</p>
        </div>
      </div>
    </div>
  );
}
