import { ExternalLink, Folder, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

interface AddBookmarkDialogProps {
  parentFolderName: string | null;
  onAdd: (label: string, type: 'folder' | 'link', url?: string) => void;
  onClose: () => void;
}

export function AddBookmarkDialog({ parentFolderName, onAdd, onClose }: AddBookmarkDialogProps) {
  const [type, setType] = useState<'link' | 'folder'>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (type === 'link' && !url.trim()) return;
    onAdd(trimmedTitle, type, type === 'link' ? url.trim() : undefined);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-[#252526] border border-[#454545] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#454545] bg-[#333333]">
          <h2 className="text-sm font-medium text-white">
            Add to {parentFolderName ?? 'Bookmarks'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#454545] rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4" onKeyDown={handleKeyDown}>
          {/* Type selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setType('link')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-medium transition-colors border',
                type === 'link'
                  ? 'bg-[#0e639c] border-[#0e639c] text-white'
                  : 'bg-[#1e1e1e] border-[#454545] text-gray-400 hover:text-white'
              )}
            >
              <ExternalLink size={14} />
              Link
            </button>
            <button
              onClick={() => setType('folder')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-medium transition-colors border',
                type === 'folder'
                  ? 'bg-[#0e639c] border-[#0e639c] text-white'
                  : 'bg-[#1e1e1e] border-[#454545] text-gray-400 hover:text-white'
              )}
            >
              <Folder size={14} />
              Folder
            </button>
          </div>

          {/* Title input */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'link' ? 'e.g. GitHub' : 'e.g. Work'}
              autoFocus
              className="w-full bg-[#3c3c3c] border border-[#454545] rounded px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#007acc] transition-colors"
            />
          </div>

          {/* URL input (link only) */}
          {type === 'link' && (
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-[#3c3c3c] border border-[#454545] rounded px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#007acc] transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#454545]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded hover:bg-[#454545] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || (type === 'link' && !url.trim())}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0e639c] rounded hover:bg-[#1177bb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
