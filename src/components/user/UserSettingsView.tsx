import { Clipboard, FileJson, FileUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDialog } from '../../context/DialogContext';
import { useUser } from '../../context/UserContext';
import { cn } from '../../utils/cn';

export function UserSettingsView() {
  const { 
    profile, 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspace,
    createWorkspace,
    updateProfile,
    editWorkspace,
    deleteWorkspace,
    importData,
    exportData
  } = useUser();
  const { showAlert, showConfirm, showPrompt } = useDialog();

  const [displayName, setDisplayName] = useState(profile?.displayName || 'User');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState('');
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

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

  const handleCreateWorkspace = async () => {
    const name = await showPrompt('Enter workspace name:');
    if (name?.trim()) {
      try {
        await createWorkspace(name.trim());
      } catch (error) {
        console.error('Failed to create workspace:', error);
        await showAlert('Failed to create workspace');
      }
    }
  };

  const handleEditWorkspace = (workspaceId: string, currentName: string) => {
    setEditingWorkspaceId(workspaceId);
    setEditingWorkspaceName(currentName);
  };

  const handleSaveWorkspaceName = async () => {
    if (!editingWorkspaceId || !editingWorkspaceName.trim()) {
      setEditingWorkspaceId(null);
      setEditingWorkspaceName('');
      return;
    }

    try {
      await editWorkspace(editingWorkspaceId, editingWorkspaceName.trim());
    } catch (error) {
      console.error('Failed to update workspace:', error);
      await showAlert('Failed to update workspace');
    } finally {
      setEditingWorkspaceId(null);
      setEditingWorkspaceName('');
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (await showConfirm('Are you sure you want to delete this workspace?')) {
      try {
        await deleteWorkspace(workspaceId);
      } catch (error) {
        console.error('Failed to delete workspace:', error);
        await showAlert(error instanceof Error ? error.message : 'Failed to delete workspace');
      }
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

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vsdesk-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      await showAlert('Failed to export data');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--app-bg)] text-[var(--text-primary)] font-sans overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-secondary)] bg-[var(--sidebar-bg)] shrink-0">
        <h1 className="text-xl font-semibold text-[var(--text-heading)]">User Settings</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Manage your profile and workspaces</p>
      </div>

      <div className="flex-1 p-6 space-y-8 max-w-4xl">
        {/* Profile Section */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-[var(--focus-border)]" />
            Profile
          </h2>

          <div className="space-y-6 bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] rounded-sm p-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-vscode-activityBarBadge-bg flex items-center justify-center text-[var(--text-heading)] font-bold text-2xl overflow-hidden">
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
                placeholder="🎨 or https://example.com/avatar.jpg"
              />
              <div className="text-xs text-[var(--text-muted)]">
                Use an emoji (e.g., 🎨) or paste an image URL
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
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-[var(--focus-border)]" />
            Workspaces
          </h2>

          <div className="bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] rounded-sm overflow-hidden">
            <div className="divide-y divide-[var(--border-secondary)]">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={cn(
                    "flex items-center gap-3 p-4 hover:bg-[var(--hover-bg)] transition-colors group",
                    activeWorkspaceId === workspace.id && "bg-[var(--active-bg)]"
                  )}
                >
                  <div className="flex-1">
                    {editingWorkspaceId === workspace.id ? (
                      <input
                        type="text"
                        value={editingWorkspaceName}
                        onChange={(e) => setEditingWorkspaceName(e.target.value)}
                        onBlur={() => handleSaveWorkspaceName()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveWorkspaceName();
                          if (e.key === 'Escape') setEditingWorkspaceId(null);
                        }}
                        className="w-full bg-[var(--input-bg)] border border-[var(--focus-border)] text-sm text-[var(--text-primary)] px-2 py-1 outline-none rounded-sm"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text-heading)]">
                          {workspace.name}
                        </span>
                        {activeWorkspaceId === workspace.id && (
                          <span className="text-xs bg-[var(--focus-border)] text-[var(--accent-fg)] px-2 py-0.5 rounded-sm">
                            Active
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      Created {new Date(workspace.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {activeWorkspaceId !== workspace.id && (
                      <button
                        onClick={() => setActiveWorkspace(workspace.id)}
                        className="px-3 py-1.5 text-xs bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-sm transition-colors"
                      >
                        Switch
                      </button>
                    )}
                    <button
                      onClick={() => handleEditWorkspace(workspace.id, workspace.name)}
                      className="p-1.5 hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                      title="Rename workspace"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {workspaces.length > 1 && workspace.id !== activeWorkspaceId && (
                      <button
                        onClick={() => handleDeleteWorkspace(workspace.id)}
                        className="p-1.5 hover:bg-[var(--bg-error-hover)] text-[var(--text-error)] rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete workspace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Workspace Button */}
            <button
              onClick={handleCreateWorkspace}
              className="w-full p-4 flex items-center gap-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors border-t border-[var(--border-secondary)]"
            >
              <Plus className="w-4 h-4" />
              <span>New Workspace</span>
            </button>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="pb-8">
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
      </div>
    </div>
  );
}
