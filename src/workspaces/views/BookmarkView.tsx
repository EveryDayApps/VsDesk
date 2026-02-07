import { Bookmark } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import type { BookmarkItem } from '../../hooks/useBookmarks';
import { useBookmarks } from '../../hooks/useBookmarks';

function countItems(items: BookmarkItem[]): { links: number; folders: number } {
  let links = 0;
  let folders = 0;
  for (const item of items) {
    if (item.type === 'folder') {
      folders++;
      if (item.children) {
        const sub = countItems(item.children);
        links += sub.links;
        folders += sub.folders;
      }
    } else {
      links++;
    }
  }
  return { links, folders };
}

export function BookmarkView() {
  const { activeWorkspaceId } = useUser();
  const { bookmarks, isLoading } = useBookmarks(activeWorkspaceId || 'default');
  const counts = countItems(bookmarks);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-vscode-text">
        Loading bookmarks...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 pt-8">
          <Bookmark className="w-8 h-8 text-vscode-blue" />
          <h1 className="text-2xl font-bold text-white">Bookmark Manager</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">{counts.links}</div>
            <div className="text-sm text-vscode-text mt-1">Bookmarks</div>
          </div>
          <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">{counts.folders}</div>
            <div className="text-sm text-vscode-text mt-1">Folders</div>
          </div>
        </div>
        <p className="text-sm text-vscode-text">
          Use the sidebar to browse and manage your bookmarks. Click any bookmark to open it in a new tab.
        </p>
      </div>
    </div>
  );
}
