import { Bookmark } from 'lucide-react';
import { WorkspaceDefinition } from '../types/workspace';
import { BookmarkView } from './views/BookmarkView';
import { BookmarkSidebar } from '../components/bookmarks/BookmarkSidebar';

export const bookmarkWorkspace: WorkspaceDefinition = {
  id: 'bookmarks',
  title: 'Bookmarks',
  icon: Bookmark,
  component: BookmarkView,
  sidebarConfig: {
    component: BookmarkSidebar,
    title: 'Bookmarks',
    enabled: true,
  },
  shortcutIndex: 2,
  position: 'top',
};
