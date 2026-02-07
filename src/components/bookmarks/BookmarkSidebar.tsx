import {
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Folder,
    FolderOpen,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { BookmarkItem, useBookmarks } from '../../hooks/useBookmarks';
import { cn } from '../../utils/cn';
import { AddBookmarkDialog } from './AddBookmarkDialog';
import { EditBookmarkDialog } from './EditBookmarkDialog';

function getFaviconUrl(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
}

function Favicon({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  const faviconUrl = getFaviconUrl(url);

  if (!faviconUrl || failed) {
    return <ExternalLink className="w-4 h-4 text-blue-400/80" />;
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      width={16}
      height={16}
      className="w-4 h-4 rounded-full"
      onError={() => setFailed(true)}
    />
  );
}

export function BookmarkSidebar() {
  const { activeWorkspaceId } = useUser();
  const { bookmarks, addItem, editItem, removeItem, toggleCollapse } = useBookmarks(activeWorkspaceId || 'default');
  const [dialogParentId, setDialogParentId] = useState<string | null | undefined>(undefined);
  const [dialogParentName, setDialogParentName] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<BookmarkItem | null>(null);

  const isDialogOpen = dialogParentId !== undefined;

  const openDialog = (parentId: string | null, parentName: string | null) => {
    setDialogParentId(parentId);
    setDialogParentName(parentName);
  };

  const closeDialog = () => {
    setDialogParentId(undefined);
    setDialogParentName(null);
  };

  const handleAdd = (label: string, type: 'folder' | 'link', url?: string) => {
    addItem(dialogParentId ?? null, label, type, url);
  };

  const renderTree = (items: BookmarkItem[], depth = 0) => {
    return items.map((item) => {
      const isFolder = item.type === 'folder';

      return (
        <div key={item.id}>
          <div
            className={cn(
              'group flex items-center px-2 py-1 cursor-pointer select-none transition-colors text-sm text-gray-400 hover:bg-vscode-list-hover hover:text-white'
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => {
              if (isFolder) {
                toggleCollapse(item.id);
              } else if (item.url) {
                window.open(item.url, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            {/* Chevron for folders */}
            {isFolder && (
              <span className="mr-1 shrink-0">
                {item.collapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </span>
            )}

            {/* Icon */}
            <span className="mr-2 shrink-0">
              {isFolder ? (
                item.collapsed ? (
                  <Folder className="w-4 h-4 text-yellow-500/80" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-yellow-500/80" />
                )
              ) : item.url ? (
                <Favicon url={item.url} />
              ) : (
                <ExternalLink className="w-4 h-4 text-blue-400/80" />
              )}
            </span>

            {/* Label */}
            <span className="truncate flex-1">{item.label}</span>

            {/* Hover actions */}
            <span className="hidden group-hover:flex items-center gap-0.5 shrink-0">
              {isFolder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDialog(item.id, item.label);
                  }}
                  className="p-0.5 hover:text-white rounded hover:bg-[#454545] transition-colors"
                  title="Add to folder"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingItem(item);
                }}
                className="p-0.5 hover:text-white rounded hover:bg-[#454545] transition-colors"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="p-0.5 hover:text-red-400 rounded hover:bg-[#454545] transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>

          {/* Children */}
          {isFolder && !item.collapsed && item.children && item.children.length > 0 && (
            <div>{renderTree(item.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-64 bg-vscode-sidebar border-r border-gray-800 flex flex-col h-full pt-2">
      <div className="px-5 mb-2 flex items-center justify-between text-xs text-vscode-text uppercase tracking-wider font-semibold">
        <span>Bookmarks</span>
        <button
          onClick={() => openDialog(null, null)}
          className="hover:text-white transition-colors"
          title="Add bookmark"
        >
          <Plus className="w-4 h-4 cursor-pointer" />
        </button>
      </div>

      <vscode-scrollable className="flex-1">
        {bookmarks.length === 0 ? (
          <div className="px-5 py-4 text-xs text-gray-500 text-center">
            No bookmarks yet. Click + to add one.
          </div>
        ) : (
          renderTree(bookmarks)
        )}
      </vscode-scrollable>

      {isDialogOpen && (
        <AddBookmarkDialog
          parentFolderName={dialogParentName}
          onAdd={handleAdd}
          onClose={closeDialog}
        />
      )}

      {editingItem && (
        <EditBookmarkDialog
          item={editingItem}
          onSave={editItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
