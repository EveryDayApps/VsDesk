import { RotateCcw, X } from 'lucide-react';
import { SettingsState, useSettings } from '../../context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSetting, resetSettings } = useSettings();

  if (!isOpen) return null;

  const sections: { title: string; items: { key: keyof SettingsState; label: string }[] }[] = [
    {
      title: 'Layout',
      items: [
        { key: 'showTitleBar', label: 'Title Bar' },
        { key: 'showActivityBar', label: 'Activity Bar' },
        { key: 'showSidebar', label: 'Sidebar' },
        { key: 'showStatusBar', label: 'Status Bar' },
      ]
    },
    {
      title: 'Widgets',
      items: [
        { key: 'showClock', label: 'Clock' },
        { key: 'showGoogleSearch', label: 'Google Search' },
        { key: 'showQuickLinks', label: 'Quick Links' },
        { key: 'showNotes', label: 'Notes' },
        { key: 'showTodoList', label: 'Todo List' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#252526] border border-[#454545] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#454545] bg-[#333333] shrink-0">
          <h2 className="text-sm font-medium text-white">Settings</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#454545] rounded"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">{section.title}</h3>
              <div className="space-y-1 bg-[#1e1e1e] rounded-md border border-[#333333] p-1">
                {section.items.map((item) => (
                  <label 
                    key={item.key} 
                    className="flex items-center justify-between group cursor-pointer p-3 rounded hover:bg-[#2a2d2e] transition-colors"
                  >
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                    <button
                      role="switch"
                      aria-checked={settings[item.key]}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent label click from triggering twice if nested
                        updateSetting(item.key, !settings[item.key]);
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1e] ${
                        settings[item.key] ? 'bg-blue-600' : 'bg-[#454545]'
                      }`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings[item.key] ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#454545] bg-[#252526] shrink-0 flex justify-between items-center text-xs">
            <span className="text-gray-500">Toggle sections to customize your workspace</span>
            <button 
              onClick={resetSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-[#454545] text-vscode-text hover:text-white transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>
        </div>
      </div>
    </div>
  );
}
