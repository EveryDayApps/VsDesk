import { Check, Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { WorkspaceRecord } from '../../db';
import { Overlay } from '../ui/Overlay';

interface WorkspaceSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceSwitcher({ isOpen, onClose }: WorkspaceSwitcherProps) {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, createWorkspace, editWorkspace, deleteWorkspace } = useUser();
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!isOpen) return null;

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    
    await createWorkspace(newWorkspaceName.trim());
    setNewWorkspaceName('');
    setIsCreating(false);
  };

  const handleSwitchWorkspace = async (workspaceId: string) => {
    await setActiveWorkspace(workspaceId);
    onClose();
  };

  const handleDeleteWorkspace = async (workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't allow deleting the last workspace
    if (workspaces.length <= 1) {
      alert('Cannot delete the last workspace');
      return;
    }

    // Don't allow deleting the active workspace
    if (workspaceId === activeWorkspaceId) {
      alert('Cannot delete the active workspace. Switch to another workspace first.');
      return;
    }

    if (confirm('Are you sure you want to delete this workspace?')) {
      try {
        await deleteWorkspace(workspaceId);
      } catch (error) {
        console.error('Failed to delete workspace:', error);
        alert('Failed to delete workspace');
      }
    }
  };

  const handleStartEdit = (workspace: WorkspaceRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(workspace.id);
    setEditingName(workspace.name);
  };

  const handleSaveEdit = async (workspaceId: string) => {
    if (!editingName.trim()) return;
    
    try {
      await editWorkspace(workspaceId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Failed to update workspace:', error);
      alert('Failed to update workspace');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <Overlay onClose={onClose}>
      {/* Modal */}
      <div 
        className="absolute bottom-8 left-4 w-80 bg-vscode-sidebar border border-vscode-border rounded shadow-lg animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-vscode-border">
          <h3 className="text-sm font-semibold text-vscode-text">Switch Workspace</h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {/* Workspace List */}
          <div className="py-1">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => editingId !== workspace.id && handleSwitchWorkspace(workspace.id)}
                className="flex items-center justify-between px-3 py-2 hover:bg-vscode-list-hover cursor-pointer group"
              >
                <div className="flex items-center gap-2 flex-1">
                  {activeWorkspaceId === workspace.id && (
                    <Check className="w-4 h-4 text-vscode-blue" />
                  )}
                  
                  {editingId === workspace.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(workspace.id);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-2 py-1 text-sm bg-vscode-input text-vscode-text border border-vscode-border rounded focus:outline-none focus:border-vscode-blue"
                      autoFocus
                    />
                  ) : (
                    <span className={`text-sm ${
                      activeWorkspaceId === workspace.id 
                        ? 'text-vscode-text font-medium' 
                        : 'text-vscode-text/80'
                    }`}>
                      {workspace.name}
                    </span>
                  )}
                </div>
                
                {editingId === workspace.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit(workspace.id);
                      }}
                      className="px-2 py-1 text-xs bg-vscode-blue text-white rounded hover:bg-vscode-blue/90"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelEdit();
                      }}
                      className="px-2 py-1 text-xs bg-vscode-button text-vscode-text rounded hover:bg-vscode-button/80"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    {/* Rename button */}
                    <button
                      onClick={(e) => handleStartEdit(workspace, e)}
                      className="p-1 hover:bg-vscode-list-active rounded transition-opacity"
                      title="Rename workspace"
                    >
                      <Edit2 className="w-3 h-3 text-vscode-text/60 hover:text-vscode-blue" />
                    </button>
                    
                    {/* Delete button - only show if not active and not the last workspace */}
                    {workspace.id !== activeWorkspaceId && workspaces.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteWorkspace(workspace.id, e)}
                        className="p-1 hover:bg-vscode-list-active rounded transition-opacity"
                        title="Delete workspace"
                      >
                        <Trash2 className="w-3 h-3 text-vscode-text/60 hover:text-red-400" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create New Workspace */}
          <div className="border-t border-vscode-border py-1">
            {isCreating ? (
              <div className="px-3 py-2">
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateWorkspace();
                    } else if (e.key === 'Escape') {
                      setIsCreating(false);
                      setNewWorkspaceName('');
                    }
                  }}
                  placeholder="Workspace name..."
                  className="w-full px-2 py-1 text-sm bg-vscode-input text-vscode-text border border-vscode-border rounded focus:outline-none focus:border-vscode-blue"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCreateWorkspace}
                    className="flex-1 px-2 py-1 text-xs bg-vscode-blue text-white rounded hover:bg-vscode-blue/90"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewWorkspaceName('');
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-vscode-button text-vscode-text rounded hover:bg-vscode-button/80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-vscode-list-hover text-vscode-text/80 hover:text-vscode-text"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Create New Workspace</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Overlay>
  );
}
