import {
  Check,
  Clipboard,
  FileJson,
  FileUp,
  Filter,
  Layout,
  LogOut,
  Palette,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  Upload,
  User,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { useDialog } from '../../context/DialogContext';
import { SettingsState, useSettings } from '../../context/SettingsContext';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

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
  'Themes': {
    label: 'Themes',
    icon: Palette,
    items: []
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
  const { showAlert, showConfirm } = useDialog();
  const { activeTheme, themes, setTheme, importTheme, deleteTheme } = useTheme();

  const [activeCategory, setActiveCategory] = useState<string>('Commonly Used');
  const [searchQuery, setSearchQuery] = useState('');

  // User profile state
  const [displayName, setDisplayName] = useState(profile?.displayName || 'User');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [themeImportError, setThemeImportError] = useState<string | null>(null);
  const [themeImportText, setThemeImportText] = useState('');
  
  // Data management state
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Handler functions
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim() || 'User',
        avatarUrl: avatarUrl.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      await showAlert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      await showAlert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (await showConfirm('Are you sure you want to reset all data? This cannot be undone.')) {
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
      await showAlert('Export failed');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (content) {
        try {
          setIsImporting(true);
          await importData(content);
        } catch (error) {
          console.error('Import failed:', error);
          await showAlert('Failed to import data: ' + (error instanceof Error ? error.message : 'Unknown error'));
          setIsImporting(false);
        }
      }
    };
    reader.readAsText(file);
    // Reset inputs
    event.target.value = '';
  };

  const handlePasteImport = async () => {
    if (!importText.trim()) return;
    
    try {
      setIsImporting(true);
      await importData(importText);
    } catch (error) {
      console.error('Import failed:', error);
      await showAlert('Failed to import data: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsImporting(false);
    }
  };



  const handleThemePaste = async () => {
    if (!themeImportText.trim()) return;
    setThemeImportError(null);
    try {
      const theme = await importTheme(themeImportText);
      await setTheme(theme.id);
      setThemeImportText('');
    } catch (err) {
      setThemeImportError(err instanceof Error ? err.message : 'Import failed');
    }
  };

  const handleDeleteTheme = async (id: string) => {
    if (await showConfirm('Delete this imported theme?')) {
      await deleteTheme(id);
    }
  };

  const filterItems = (categoryOverride?: string) => {
    const category = categoryOverride || activeCategory;
    const section = SECTION_MAP[category];
    if (!section) return [];

    if (!searchQuery) return section.items;

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
  const uniqueItems = searchQuery
    ? Array.from(new Map(displayedItems.map(item => [item.key, item])).values())
    : displayedItems;

  const builtinThemes = themes.filter(t => t.type === 'builtin');
  const importedThemes = themes.filter(t => t.type === 'imported');

  return (
    <div className="flex flex-col h-full bg-[var(--app-bg)] text-[var(--text-primary)] font-sans">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-[var(--border-secondary)] bg-[var(--sidebar-bg)] shrink-0">
        <div className="text-xs text-[var(--text-secondary)] mr-4">User Settings</div>
        <div className="flex-1 max-w-2xl relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search size={14} className="text-[var(--text-primary)]" />
          </div>
          <input
            type="text"
            className="w-full bg-[var(--input-bg)] border border-transparent focus:border-[var(--focus-border)] text-sm text-[var(--text-primary)] pl-8 pr-2 py-1 outline-none placeholder-[var(--text-muted)]"
            placeholder="Search settings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
             <Filter size={14} className="text-[var(--text-primary)]" />
          </div>
        </div>
        <div className="ml-4 flex items-center space-x-2">
            <button
                onClick={resetSettings}
                className="p-1 hover:bg-[var(--input-bg)] rounded text-[var(--text-primary)]"
                title="Reset Settings"
            >
                <RotateCcw size={16} />
            </button>
            {onClose && (
              <button
                  onClick={onClose}
                  className="p-1 hover:bg-[var(--input-bg)] rounded text-[var(--text-primary)]"
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
            <div className="w-48 bg-[var(--sidebar-bg)] border-r border-[var(--border-secondary)] overflow-y-auto">
            <div className="py-2">
                {Object.entries(SECTION_MAP).map(([category, section]) => {
                  const Icon = section.icon;
                  return (
                    <div
                        key={category}
                        className={`px-4 py-1.5 cursor-pointer text-sm flex items-center gap-2 ${
                        activeCategory === category
                            ? 'bg-[var(--active-bg)] text-[var(--text-heading)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                        }`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {activeCategory === category && <div className="w-0.5 h-4 bg-[var(--text-heading)] absolute left-0" />}
                        <Icon size={16} />
                        <span>{category}</span>
                    </div>
                  );
                })}
            </div>
            </div>
        )}

        {/* content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--app-bg)]">
            {searchQuery && (
                <div className="text-sm text-[var(--text-secondary)] mb-4">
                    Found {uniqueItems.length} settings matching "{searchQuery}"
                </div>
            )}

            {/* Themes Section */}
            {activeCategory === 'Themes' && !searchQuery ? (
              <div className="space-y-8 max-w-4xl">
                <section>
                  <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[var(--focus-border)]" />
                    Color Theme
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">
                    Select a color theme for the workbench.
                  </p>

                  {/* Built-in Themes */}
                  <div className="bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] rounded-sm overflow-hidden">
                    {builtinThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={cn(
                          "w-full p-3 flex items-center gap-3 text-sm transition-colors border-b border-[var(--border-secondary)] last:border-b-0",
                          activeTheme?.id === theme.id
                            ? "bg-[var(--selection-bg)] text-[var(--selection-fg)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                        )}
                      >
                        <div
                          className="w-5 h-5 rounded-sm border border-[var(--border-color)] flex-shrink-0"
                          style={{ backgroundColor: theme.colors['editor.background'] || '#1e1e1e' }}
                        />
                        <div className="flex-1 text-left">
                          <span className="font-medium">{theme.name}</span>
                          <span className="ml-2 text-xs opacity-60">{theme.base}</span>
                        </div>
                        {activeTheme?.id === theme.id && (
                          <Check className="w-4 h-4 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Imported Themes */}
                {importedThemes.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-[var(--focus-border)]" />
                      Imported Themes
                    </h2>

                    <div className="bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] rounded-sm overflow-hidden">
                      {importedThemes.map((theme) => (
                        <div
                          key={theme.id}
                          className={cn(
                            "w-full p-3 flex items-center gap-3 text-sm transition-colors border-b border-[var(--border-secondary)] last:border-b-0",
                            activeTheme?.id === theme.id
                              ? "bg-[var(--selection-bg)] text-[var(--selection-fg)]"
                              : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                          )}
                        >
                          <button
                            onClick={() => setTheme(theme.id)}
                            className="flex items-center gap-3 flex-1 text-left"
                          >
                            <div
                              className="w-5 h-5 rounded-sm border border-[var(--border-color)] flex-shrink-0"
                              style={{ backgroundColor: theme.colors['editor.background'] || '#1e1e1e' }}
                            />
                            <div className="flex-1">
                              <span className="font-medium">{theme.name}</span>
                              <span className="ml-2 text-xs opacity-60">{theme.base}</span>
                            </div>
                            {activeTheme?.id === theme.id && (
                              <Check className="w-4 h-4 flex-shrink-0" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteTheme(theme.id)}
                            className="p-1 hover:bg-[var(--hover-bg)] rounded text-[var(--text-muted)] hover:text-red-400 transition-colors"
                            title="Delete theme"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Import Theme */}
                <section>
                  <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[var(--focus-border)]" />
                    Import Theme
                  </h2>

                  <div className="bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] rounded-sm overflow-hidden p-6 space-y-6">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        Import a VS Code theme from a .json file or paste the JSON content directly.
                      </p>
                    </div>

                    {/* Option 1: File Import */}
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-[var(--text-heading)] uppercase tracking-wider">
                        Option 1: Upload Theme File
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] rounded-sm cursor-pointer transition-colors">
                          <Upload className="w-4 h-4" />
                          Select File
                          <input
                             type="file"
                             accept=".json"
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                  file.text().then(text => {
                                      importTheme(text).then(theme => setTheme(theme.id)).catch(err => setThemeImportError(err.message));
                                  });
                                  e.target.value = '';
                               }
                             }}
                             className="hidden"
                          />
                        </label>
                        <span className="text-xs text-[var(--text-muted)]">
                          Supports .json files
                        </span>
                      </div>
                    </div>

                    {/* Option 2: Paste Import */}
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-[var(--text-heading)] uppercase tracking-wider">
                        Option 2: Copy & Paste JSON
                      </label>
                      <div className="space-y-3">
                        <textarea
                          value={themeImportText}
                          onChange={(e) => setThemeImportText(e.target.value)}
                          rows={5}
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[var(--focus-border)] text-xs font-mono text-[var(--text-primary)] p-3 outline-none rounded-sm resize-y"
                          placeholder="{ 'name': 'My Theme', 'colors': { ... } }"
                        />
                        <button
                          onClick={handleThemePaste}
                          disabled={!themeImportText.trim()}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-sm transition-colors disabled:opacity-50"
                        >
                          <Clipboard className="w-4 h-4" />
                          Import Theme from Text
                        </button>
                      </div>
                    </div>
                  </div>

                  {themeImportError && (
                    <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded-sm text-xs text-red-400">
                      {themeImportError}
                    </div>
                  )}
                </section>
              </div>
            ) : activeCategory === 'User' && !searchQuery ? (
              <div className="space-y-8 max-w-4xl">
                {/* Profile Section */}
                <section>
                  <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[var(--focus-border)]" />
                    Profile
                  </h2>

                  <div className="space-y-6 bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] rounded-sm p-6">
                    {/* Avatar Preview */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--accent-fg)] font-bold text-2xl overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          displayName?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-[var(--text-heading)] font-medium mb-1">Profile Picture</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          Enter an emoji or image URL
                        </div>
                      </div>
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                      <label htmlFor="displayName" className="block text-sm font-medium text-[var(--text-heading)]">
                        Display Name
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[var(--focus-border)] text-sm text-[var(--text-primary)] px-3 py-2 outline-none placeholder-[var(--text-muted)] rounded-sm transition-colors"
                        placeholder="Enter your display name"
                        maxLength={50}
                      />
                      <div className="text-xs text-[var(--text-muted)]">
                        This name will be displayed in the account panel
                      </div>
                    </div>

                    {/* Avatar URL */}
                    <div className="space-y-2">
                      <label htmlFor="avatarUrl" className="block text-sm font-medium text-[var(--text-heading)]">
                        Avatar
                      </label>
                      <input
                        id="avatarUrl"
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[var(--focus-border)] text-sm text-[var(--text-primary)] px-3 py-2 outline-none placeholder-[var(--text-muted)] rounded-sm transition-colors"
                        placeholder="or https://example.com/avatar.jpg"
                      />
                      <div className="text-xs text-[var(--text-muted)]">
                        Use an emoji or paste an image URL
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-[var(--text-heading)]">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[var(--focus-border)] text-sm text-[var(--text-primary)] px-3 py-2 outline-none placeholder-[var(--text-muted)] rounded-sm resize-none transition-colors"
                        placeholder="Tell us about yourself (optional)"
                        maxLength={200}
                      />
                      <div className="text-xs text-[var(--text-muted)] flex justify-between">
                        <span>Optional personal description</span>
                        <span>{bio.length}/200</span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving || !displayName.trim()}
                        className="px-4 py-2 text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Workspaces Section */}


                {/* Data Management Section */}
                <section>
                  <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[var(--focus-border)]" />
                    Data Management
                  </h2>

                  <div className="bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] rounded-sm overflow-hidden p-6 space-y-8">
                    
                    {/* Export Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-[var(--text-heading)]">Export Data</h3>
                      <p className="text-xs text-[var(--text-muted)] mb-3">
                        Download a backup of your profiles, workspaces, and settings.
                      </p>
                      <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-sm transition-colors"
                      >
                        <FileJson className="w-4 h-4" />
                        Export Backup
                      </button>
                    </div>

                    <div className="w-full h-px bg-[var(--border-secondary)]" />

                    {/* Import Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-[var(--text-heading)] mb-1">Import Data</h3>
                        <p className="text-xs text-[var(--text-muted)]">
                          Restore from a backup file or paste JSON data directly.
                        </p>
                      </div>

                      {/* Option 1: File Import */}
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-[var(--text-heading)] uppercase tracking-wider">
                          Option 1: Upload JSON File
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] rounded-sm cursor-pointer transition-colors">
                            <FileUp className="w-4 h-4" />
                            {isImporting ? 'Importing...' : 'Select File'}
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleFileUpload}
                              disabled={isImporting}
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-[var(--text-muted)]">
                            Supports .json files
                          </span>
                        </div>
                      </div>

                      {/* Option 2: Paste Import */}
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-[var(--text-heading)] uppercase tracking-wider">
                          Option 2: Copy & Paste JSON
                        </label>
                        <div className="space-y-3">
                          <textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            rows={5}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[var(--focus-border)] text-xs font-mono text-[var(--text-primary)] p-3 outline-none rounded-sm resize-y"
                            placeholder="{ 'users': [...], 'workspaces': [...] }"
                          />
                          <button
                            onClick={handlePasteImport}
                            disabled={isImporting || !importText.trim()}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-sm transition-colors disabled:opacity-50"
                          >
                            <Clipboard className="w-4 h-4" />
                            {isImporting ? 'Importing...' : 'Import from Text'}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Danger Zone */}
                <section>
                  <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-red-400" />
                    Danger Zone
                  </h2>

                  <div className="bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] rounded-sm overflow-hidden">
                    <button
                      onClick={handleReset}
                      className="w-full p-4 flex items-center gap-3 text-sm text-red-400 hover:bg-[var(--hover-bg)] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">Reset User Info</div>
                        <div className="text-xs text-[var(--text-muted)]">Clear all data and start fresh</div>
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
                                        className="appearance-none w-4 h-4 border border-[var(--text-muted)] rounded-sm bg-[var(--input-bg)] checked:bg-[var(--focus-border)] checked:border-[var(--focus-border)] focus:ring-1 focus:ring-[var(--focus-border)] focus:ring-offset-0 focus:outline-none relative after:content-['✓'] after:hidden checked:after:block after:absolute after:text-white after:text-[10px] after:font-bold after:left-[3px] after:top-[1px]"
                                    />
                                    <span className="text-sm font-bold text-[var(--text-heading)] select-none">{item.label}</span>
                                </label>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 ml-6 select-none leading-normal max-w-2xl">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                        <div className="h-px bg-[var(--border-secondary)] w-full mt-4" />
                    </div>
                ))}

                {uniqueItems.length === 0 && (
                    <div className="text-center text-[var(--text-secondary)] py-10">
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
