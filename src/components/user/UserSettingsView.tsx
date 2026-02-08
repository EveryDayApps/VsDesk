import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
    deleteWorkspace
  } = useUser();

  const [displayName, setDisplayName] = useState(profile?.displayName || 'User');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState('');

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

  const handleCreateWorkspace = async () => {
    const name = prompt('Enter workspace name:');
    if (name?.trim()) {
      try {
        await createWorkspace(name.trim());
      } catch (error) {
        console.error('Failed to create workspace:', error);
        alert('Failed to create workspace');
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
      alert('Failed to update workspace');
    } finally {
      setEditingWorkspaceId(null);
      setEditingWorkspaceName('');
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (confirm('Are you sure you want to delete this workspace?')) {
      try {
        await deleteWorkspace(workspaceId);
      } catch (error) {
        console.error('Failed to delete workspace:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete workspace');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-sans overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#2b2b2b] bg-[#252526] shrink-0">
        <h1 className="text-xl font-semibold text-white">User Settings</h1>
        <p className="text-xs text-[#969696] mt-1">Manage your profile and workspaces</p>
      </div>

      <div className="flex-1 p-6 space-y-8 max-w-4xl">
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
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#007fd4]" />
            Workspaces
          </h2>

          <div className="bg-[#252526] border border-[#2b2b2b] rounded-sm overflow-hidden">
            <div className="divide-y divide-[#2b2b2b]">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={cn(
                    "flex items-center gap-3 p-4 hover:bg-[#2a2d2e] transition-colors group",
                    activeWorkspaceId === workspace.id && "bg-[#37373d]"
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
                        className="w-full bg-[#3c3c3c] border border-[#007fd4] text-sm text-[#cccccc] px-2 py-1 outline-none rounded-sm"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#e7e7e7]">
                          {workspace.name}
                        </span>
                        {activeWorkspaceId === workspace.id && (
                          <span className="text-xs bg-[#007fd4] text-white px-2 py-0.5 rounded-sm">
                            Active
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-[#858585] mt-1">
                      Created {new Date(workspace.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {activeWorkspaceId !== workspace.id && (
                      <button
                        onClick={() => setActiveWorkspace(workspace.id)}
                        className="px-3 py-1.5 text-xs bg-[#3c3c3c] hover:bg-[#454545] text-[#cccccc] rounded-sm transition-colors"
                      >
                        Switch
                      </button>
                    )}
                    <button
                      onClick={() => handleEditWorkspace(workspace.id, workspace.name)}
                      className="p-1.5 hover:bg-[#454545] text-[#cccccc] rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                      title="Rename workspace"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {workspaces.length > 1 && workspace.id !== activeWorkspaceId && (
                      <button
                        onClick={() => handleDeleteWorkspace(workspace.id)}
                        className="p-1.5 hover:bg-[#5a1d1d] text-red-400 rounded-sm transition-colors opacity-0 group-hover:opacity-100"
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
              className="w-full p-4 flex items-center gap-2 text-sm text-[#cccccc] hover:bg-[#2a2d2e] transition-colors border-t border-[#2b2b2b]"
            >
              <Plus className="w-4 h-4" />
              <span>New Workspace</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
