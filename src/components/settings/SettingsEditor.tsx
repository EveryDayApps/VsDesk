import { Filter, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { SettingsState, useSettings } from '../../context/SettingsContext';

interface SettingsEditorProps {
  onClose: () => void;
}

const SECTION_MAP: Record<string, { label: string; items: { key: keyof SettingsState; label: string; description: string }[] }> = {
  'Commonly Used': {
    label: 'Commonly Used',
    items: [
      { key: 'showSidebar', label: 'Sidebar: Visible', description: 'Controls the visibility of the primary sidebar.' },
      { key: 'showActivityBar', label: 'Activity Bar: Visible', description: 'Controls the visibility of the activity bar.' },
      { key: 'showGoogleSearch', label: 'Widgets: Google Search', description: 'Enable or disable the Google Search widget.' },
    ]
  },
  'Workbench': {
    label: 'Workbench',
    items: [
      { key: 'showTitleBar', label: 'Title Bar: Visible', description: 'Controls the visibility of the window title bar.' },
      { key: 'showStatusBar', label: 'Status Bar: Visible', description: 'Controls the visibility of the status bar at the bottom of the window.' },
      { key: 'showSidebar', label: 'Sidebar: Visible', description: 'Controls the visibility of the primary sidebar.' },
      { key: 'showActivityBar', label: 'Activity Bar: Visible', description: 'Controls the visibility of the activity bar.' },
    ]
  },
  'Features': {
    label: 'Features',
    items: [
      { key: 'showClock', label: 'Widgets: Clock', description: 'Show the clock widget on the dashboard.' },
      { key: 'showGoogleSearch', label: 'Widgets: Google Search', description: 'Show the search widget on the dashboard.' },
      { key: 'showQuickLinks', label: 'Widgets: Quick Links', description: 'Show the quick links section on the dashboard.' },
      { key: 'showNotes', label: 'Widgets: Notes', description: 'Show the notes widget on the dashboard.' },
      { key: 'showTodoList', label: 'Widgets: Todo List', description: 'Show the todo list widget on the dashboard.' },
    ]
  }
};

export function SettingsEditor({ onClose }: SettingsEditorProps) {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [activeCategory, setActiveCategory] = useState<string>('Commonly Used');
  const [searchQuery, setSearchQuery] = useState('');

  const filterItems = (categoryOverride?: string) => {
    const category = categoryOverride || activeCategory;
    const section = SECTION_MAP[category];
    if (!section) return [];
    
    if (!searchQuery) return section.items;

    // Search across all sections if query exists, or just filter current? 
    // VS Code searches all. Let's implementing searching all if query is present.
    if (searchQuery) {
        const allItems = Object.values(SECTION_MAP).flatMap(s => s.items);
        return allItems.filter(item => 
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return section.items;
  };

  const displayedItems = filterItems();
  // Remove duplicates if searching
  const uniqueItems = searchQuery 
    ? Array.from(new Map(displayedItems.map(item => [item.key, item])).values()) 
    : displayedItems;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-sans">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-[#2b2b2b] bg-[#252526] shrink-0">
        <div className="text-xs text-[#969696] mr-4">User Settings</div>
        <div className="flex-1 max-w-2xl relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search size={14} className="text-[#cccccc]" />
          </div>
          <input
            type="text"
            className="w-full bg-[#3c3c3c] border border-transparent focus:border-[#007fd4] text-sm text-[#cccccc] pl-8 pr-2 py-1 outline-none placeholder-[#858585]"
            placeholder="Search settings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
             <Filter size={14} className="text-[#cccccc]" />
          </div>
        </div>
        <div className="ml-4 flex items-center space-x-2">
            <button 
                onClick={resetSettings}
                className="p-1 hover:bg-[#3c3c3c] rounded text-[#cccccc] title='Reset Settings'"
            >
                <RotateCcw size={16} />
            </button>
            <button 
                onClick={onClose}
                className="p-1 hover:bg-[#3c3c3c] rounded text-[#cccccc]"
                title="Close Settings"
            >
                <div className="text-xs uppercase font-bold tracking-wider">Close</div>
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!searchQuery && (
            <div className="w-48 bg-[#252526] border-r border-[#2b2b2b] overflow-y-auto">
            <div className="py-2">
                {Object.keys(SECTION_MAP).map((category) => (
                <div
                    key={category}
                    className={`px-4 py-1.5 cursor-pointer text-sm flex items-center ${
                    activeCategory === category 
                        ? 'bg-[#37373d] text-white' 
                        : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
                    }`}
                    onClick={() => setActiveCategory(category)}
                >
                    {activeCategory === category && <div className="w-0.5 h-4 bg-white absolute left-0" />}
                    {category}
                </div>
                ))}
            </div>
            </div>
        )}

        {/* content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#1e1e1e]">
            {searchQuery && (
                <div className="text-sm text-[#969696] mb-4">
                    Found {uniqueItems.length} settings matching "{searchQuery}"
                </div>
            )}
            
            <div className="space-y-6 max-w-4xl">
                {uniqueItems.map((item) => (
                    <div key={item.key} className="flex flex-col space-y-2 group">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={settings[item.key]}
                                        onChange={(e) => updateSetting(item.key, e.target.checked)}
                                        className="appearance-none w-4 h-4 border border-[#858585] rounded-sm bg-[#3c3c3c] checked:bg-[#007fd4] checked:border-[#007fd4] focus:ring-1 focus:ring-[#007fd4] focus:ring-offset-0 focus:outline-none relative after:content-['✓'] after:hidden checked:after:block after:absolute after:text-white after:text-[10px] after:font-bold after:left-[3px] after:top-[1px]"
                                    />
                                    <span className="text-sm font-bold text-[#e7e7e7] select-none">{item.label}</span>
                                </label>
                                <p className="text-xs text-[#969696] mt-1 ml-6 select-none leading-normal max-w-2xl">
                                    {item.description}
                                </p>
                            </div>
                            
                            {/* Modified indicator */}
                            {/* Assuming defaults exist somewhere visible, but for now just showing if setting is set (which it always is) */}
                        </div>
                        {/* Separator line for visual clarity, VS Code uses subtle spacing */}
                        <div className="h-px bg-[#2b2b2b] w-full mt-4" />
                    </div>
                ))}
                
                {uniqueItems.length === 0 && (
                    <div className="text-center text-[#969696] py-10">
                        No settings found.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
