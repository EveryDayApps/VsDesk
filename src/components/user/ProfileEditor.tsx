import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';

interface ProfileEditorProps {
  onClose: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { profile, updateProfile } = useUser();
  
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
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2b2b2b] bg-[#252526] shrink-0">
        <div className="text-sm font-medium text-white">Edit Profile</div>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-[#3c3c3c] rounded text-[#cccccc] transition-colors"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#1e1e1e]">
        <div className="max-w-2xl space-y-6">
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
              <div className="text-sm text-[#969696] mb-1">Profile Picture</div>
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

          {/* Divider */}
          <div className="h-px bg-[#2b2b2b]" />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-[#cccccc] hover:bg-[#3c3c3c] rounded-sm transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !displayName.trim()}
              className="px-4 py-2 text-sm bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
