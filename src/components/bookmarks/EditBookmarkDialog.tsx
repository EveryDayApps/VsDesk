import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { BookmarkItem } from '../../hooks/useBookmarks';
import { Overlay } from '../ui/Overlay';

interface EditBookmarkDialogProps {
  item: BookmarkItem;
  onSave: (id: string, label: string, url?: string) => void;
  onClose: () => void;
}

export function EditBookmarkDialog({ item, onSave, onClose }: EditBookmarkDialogProps) {
  const [title, setTitle] = useState(item.label);
  const [url, setUrl] = useState(item.url ?? '');

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (item.type === 'link' && !url.trim()) return;
    onSave(item.id, trimmedTitle, item.type === 'link' ? url.trim() : undefined);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Overlay onClose={onClose} className="flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
           onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--activitybar-bg)]">
          <h2 className="text-sm font-medium text-[var(--text-heading)]">
            Edit {item.type === 'folder' ? 'Folder' : 'Bookmark'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors p-1 hover:bg-[var(--hover-bg)] rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4" onKeyDown={handleKeyDown}>
          {/* Title input */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--focus-border)] transition-colors"
            />
          </div>

          {/* URL input (link only) */}
          {item.type === 'link' && (
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--focus-border)] transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-heading)] rounded hover:bg-[var(--hover-bg)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || (item.type === 'link' && !url.trim())}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--accent-fg)] bg-[var(--accent)] rounded hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            Save
          </button>
        </div>
      </div>
    </Overlay>
  );
}
