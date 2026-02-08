import {
  Download,
  Filter,
  Layout,
  LogOut,
  RotateCcw,
  Search,
  Settings,
  Upload,
  User,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { SettingsState, useSettings } from '../../context/SettingsContext';
import { useUser } from '../../context/UserContext';

interface SettingsEditorProps {
  onClose?: () => void;
}

const SECTION_MAP: Record<string, { label: string; icon: React.ElementType; items: { key: keyof SettingsState; label: string; description: string }[] }> = {
  'Commonly Used': {
    label: 'Commonly Used',
    icon: Settings,
    items: [
      { key: 'showSidebar', label: 'Sidebar: Visible', description: 'Controls the visibility of the primary sidebar.' },
      { key: 'showActivityBar', label: 'Activity Bar: Visible', description: 'Controls the visibility of the activity bar.' },
      { key: 'showGoogleSearch', label: 'Widgets: Google Search', description: 'Enable or disable the Google Search widget.' },
    ]
  },
  'User': {
    label: 'User',
    icon: User,
    items: []
  },
  'Workbench': {
    label: 'Workbench',
    icon: Layout,
    items: [
      { key: 'showTitleBar', label: 'Title Bar: Visible', description: 'Controls the visibility of the window title bar.' },
      { key: 'showStatusBar', label: 'Status Bar: Visible', description: 'Controls the visibility of the status bar at the bottom of the window.' },
      { key: 'showSidebar', label: 'Sidebar: Visible', description: 'Controls the visibility of the primary sidebar.' },
      { key: 'showActivityBar', label: 'Activity Bar: Visible', description: 'Controls the visibility of the activity bar.' },
    ]
  },
  'Features': {
    label: 'Features',
    icon: Zap,
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
  const { 
    profile, 
    updateProfile,
    resetUser,
    exportData,
    importData,
  } = useUser();
  
  const [activeCategory, setActiveCategory] = useState<string>('Commonly Used');
  const [searchQuery, setSearchQuery] = useState('');
  
  // User profile state
  const [displayName, setDisplayName] = useState(profile?.displayName || 'User');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Workspace editing state


  // Handler functions
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim() || 'User',
        avatarUrl: avatarUrl.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };



  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      await resetUser();
    }
  };

  const handleExport = async () => {
    try {
      const json = await exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vsdesk-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
      alert('Export failed');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (confirm('This will replace all current data. Continue?')) {
          try {
            const text = await file.text();
            await importData(text);
          } catch (e) {
            alert('Import failed: ' + e);
          }
        }
      }
    };
    input.click();
  };

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
            {onClose && (
              <button
                  onClick={onClose}
                  className="p-1 hover:bg-[#3c3c3c] rounded text-[#cccccc]"
                  title="Close Settings"
              >
                  <div className="text-xs uppercase font-bold tracking-wider">Close</div>
              </button>
            )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!searchQuery && (
            <div className="w-48 bg-[#252526] border-r border-[#2b2b2b] overflow-y-auto">
            <div className="py-2">
                {Object.entries(SECTION_MAP).map(([category, section]) => {
                  const Icon = section.icon;
                  return (
                    <div
                        key={category}
                        className={`px-4 py-1.5 cursor-pointer text-sm flex items-center gap-2 ${
                        activeCategory === category 
                            ? 'bg-[#37373d] text-white' 
                            : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
                        }`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {activeCategory === category && <div className="w-0.5 h-4 bg-white absolute left-0" />}
                        <Icon size={16} />
                        <span>{category}</span>
                    </div>
                  );
                })}
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
            
            {/* User Section - Custom UI */}
            {activeCategory === 'User' && !searchQuery ? (
              <div className="space-y-8 max-w-4xl">
                {/* Profile Section */}
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#007fd4]" />
                    Profile
                  </h2>

                  <div className="space-y-6 bg-[#252526] border border-[#2b2b2b] rounded-sm p-6">
                    {/* Avatar Preview */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-vscode-activityBarBadge-bg flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          displayName?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-[#e7e7e7] font-medium mb-1">Profile Picture</div>
                        <div className="text-xs text-[#858585]">
                          Enter an emoji or image URL
                        </div>
                      </div>
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                      <label htmlFor="displayName" className="block text-sm font-medium text-[#e7e7e7]">
                        Display Name
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-[#3c3c3c] border border-[#454545] focus:border-[#007fd4] text-sm text-[#cccccc] px-3 py-2 outline-none placeholder-[#858585] rounded-sm transition-colors"
                        placeholder="Enter your display name"
                        maxLength={50}
                      />
                      <div className="text-xs text-[#858585]">
                        This name will be displayed in the account panel
                      </div>
                    </div>

                    {/* Avatar URL */}
                    <div className="space-y-2">
                      <label htmlFor="avatarUrl" className="block text-sm font-medium text-[#e7e7e7]">
                        Avatar
                      </label>
                      <input
                        id="avatarUrl"
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full bg-[#3c3c3c] border border-[#454545] focus:border-[#007fd4] text-sm text-[#cccccc] px-3 py-2 outline-none placeholder-[#858585] rounded-sm transition-colors"
                        placeholder="🎨 or https://example.com/avatar.jpg"
                      />
                      <div className="text-xs text-[#858585]">
                        Use an emoji (e.g., 🎨) or paste an image URL
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-[#e7e7e7]">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full bg-[#3c3c3c] border border-[#454545] focus:border-[#007fd4] text-sm text-[#cccccc] px-3 py-2 outline-none placeholder-[#858585] rounded-sm resize-none transition-colors"
                        placeholder="Tell us about yourself (optional)"
                        maxLength={200}
                      />
                      <div className="text-xs text-[#858585] flex justify-between">
                        <span>Optional personal description</span>
                        <span>{bio.length}/200</span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving || !displayName.trim()}
                        className="px-4 py-2 text-sm bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Workspaces Section */}


                {/* Data Management Section */}
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#007fd4]" />
                    Data Management
                  </h2>

                  <div className="bg-[#252526] border border-[#2b2b2b] rounded-sm overflow-hidden">
                    <button 
                      onClick={handleExport}
                      className="w-full p-4 flex items-center gap-3 text-sm text-[#cccccc] hover:bg-[#2a2d2e] transition-colors border-b border-[#2b2b2b]"
                    >
                      <Download className="w-4 h-4" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">Export Data</div>
                        <div className="text-xs text-[#858585]">Download all your data as JSON</div>
                      </div>
                    </button>
                    <button 
                      onClick={handleImport}
                      className="w-full p-4 flex items-center gap-3 text-sm text-[#cccccc] hover:bg-[#2a2d2e] transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">Import Data</div>
                        <div className="text-xs text-[#858585]">Restore data from a backup file</div>
                      </div>
                    </button>
                  </div>
                </section>

                {/* Danger Zone */}
                <section>
                  <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-red-400" />
                    Danger Zone
                  </h2>

                  <div className="bg-[#252526] border border-[#2b2b2b] rounded-sm overflow-hidden">
                    <button 
                      onClick={handleReset}
                      className="w-full p-4 flex items-center gap-3 text-sm text-red-400 hover:bg-[#2a2d2e] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">Reset User Info</div>
                        <div className="text-xs text-[#858585]">Clear all data and start fresh</div>
                      </div>
                    </button>
                  </div>
                </section>
              </div>
            ) : (
              /* Standard Settings UI */
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
                        </div>
                        {/* Separator line for visual clarity */}
                        <div className="h-px bg-[#2b2b2b] w-full mt-4" />
                    </div>
                ))}
                
                {uniqueItems.length === 0 && (
                    <div className="text-center text-[#969696] py-10">
                        No settings found.
                    </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
