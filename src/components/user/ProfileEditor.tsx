import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDialog } from '../../context/DialogContext';
import { useUser } from '../../context/UserContext';

interface ProfileEditorProps {
  onClose: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { profile, updateProfile } = useUser();
  const { showAlert } = useDialog();
  
  const [displayName, setDisplayName] = useState(profile?.displayName || 'User');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setAvatarUrl(profile.avatarUrl || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim() || 'User',
        avatarUrl: avatarUrl.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      await showAlert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-[var(--app-bg)] text-[var(--text-primary)] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-secondary)] bg-[var(--sidebar-bg)] shrink-0">
        <div className="text-sm font-medium text-[var(--text-heading)]">Edit Profile</div>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-[var(--input-bg)] rounded text-[var(--text-primary)] transition-colors"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-[var(--app-bg)]">
        <div className="max-w-2xl space-y-6">
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
              <div className="text-sm text-[var(--text-secondary)] mb-1">Profile Picture</div>
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

          {/* Divider */}
          <div className="h-px bg-[var(--border-secondary)]" />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--input-bg)] rounded-sm transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !displayName.trim()}
              className="px-4 py-2 text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={14} />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
