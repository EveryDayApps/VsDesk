import { Check, Download, LogOut, Monitor, Pencil, Plus, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { cn } from '../../utils/cn';
import { Overlay } from '../ui/Overlay';
import { ProfileEditor } from '../user/ProfileEditor';

interface AccountPanelProps {
  onClose: () => void;
}

export function AccountPanel({ onClose }: AccountPanelProps) {
  const { 
    profile, 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspace, 
    createWorkspace, 
    resetUser,
    exportData,
    importData
  } = useUser();
  
  const panelRef = useRef<HTMLDivElement>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCreateWorkspace = async () => {
    const name = prompt('Enter workspace name:');
    if (name) {
      await createWorkspace(name);
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

  return (
    <div 
      ref={panelRef} 
      className="absolute left-12 bottom-12 w-72 bg-[var(--sidebar-bg)] border border-[var(--border-color)] shadow-xl text-vscode-foreground z-50 rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Profile Header */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--activitybar-bg)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-vscode-activityBarBadge-bg flex items-center justify-center text-[var(--badge-fg)] font-bold text-lg">
             {profile?.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full rounded-full" /> : (profile?.displayName?.[0] || 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate text-[var(--text-heading)]">{profile?.displayName || 'User'}</div>
            <div className="text-xs text-[var(--text-muted)]">Local Account</div>
          </div>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="p-1.5 hover:bg-[var(--hover-bg)] rounded text-[var(--text-primary)] hover:text-[var(--text-heading)] transition-colors"
            title="Edit Profile"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Workspaces Section */}
      <div className="py-2">
        <div className="px-3 pb-1 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Workspaces
        </div>
        <div className="max-h-48 overflow-y-auto custom-scrollbar">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => setActiveWorkspace(ws.id)}
              className={cn(
                "w-full text-left px-3 py-1.5 flex items-center text-sm hover:bg-[var(--hover-bg)] focus:outline-none focus:bg-[var(--selection-bg)] focus:text-white transition-colors",
                activeWorkspaceId === ws.id ? "text-[var(--text-heading)]" : "text-[var(--text-primary)]"
              )}
            >
              <div className="w-5 flex justify-center sticky">
                {activeWorkspaceId === ws.id && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="truncate">{ws.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleCreateWorkspace}
          className="w-full text-left px-3 py-1.5 flex items-center text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-heading)] transition-colors mt-1"
        >
          <div className="w-5 flex justify-center">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>New Workspace...</span>
        </button>
      </div>

      <div className="h-px bg-[var(--border-color)] my-1" />

      {/* Actions */}
      <div className="py-1">
        <button className="w-full text-left px-3 py-1.5 flex items-center text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-heading)] transition-colors">
            <div className="w-5 flex justify-center"><Monitor className="w-3.5 h-3.5" /></div>
            <span>Display Settings</span>
        </button>
        <button onClick={handleExport} className="w-full text-left px-3 py-1.5 flex items-center text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-heading)] transition-colors">
            <div className="w-5 flex justify-center"><Download className="w-3.5 h-3.5" /></div>
            <span>Export Data</span>
        </button>
        <button onClick={handleImport} className="w-full text-left px-3 py-1.5 flex items-center text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-heading)] transition-colors">
            <div className="w-5 flex justify-center"><Upload className="w-3.5 h-3.5" /></div>
            <span>Import Data</span>
        </button>
      </div>

      <div className="h-px bg-[var(--border-color)] my-1" />
      
      {/* Danger Zone */}
      <div className="py-1">
        <button 
          onClick={handleReset}
          className="w-full text-left px-3 py-1.5 flex items-center text-sm text-[var(--text-error)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-error-hover)] transition-colors"
        >
          <div className="w-5 flex justify-center">
            <LogOut className="w-3.5 h-3.5" />
          </div>
          <span>Reset User Info</span>
        </button>
      </div>

      {/* Profile Editor Modal */}
      {isEditingProfile && (
        <Overlay onClose={() => setIsEditingProfile(false)} className="z-[100] flex items-center justify-center">
          <div className="w-full max-w-3xl h-[600px] bg-[var(--app-bg)] border border-[var(--border-color)] shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150"
               onClick={(e) => e.stopPropagation()}>
            <ProfileEditor onClose={() => setIsEditingProfile(false)} />
          </div>
        </Overlay>
      )}
    </div>
  );
}
