import { type DBSchema, type IDBPDatabase, openDB } from 'idb';
import { DB_NAME, DB_VERSION } from './config';
import type { ThemeRecord } from '../theme/types';

export interface BookmarkRecord {
  id: string;
  label: string;
  type: 'folder' | 'link';
  url?: string;
  parentId: string | null;
  sortOrder: number;
  collapsed?: boolean;
  workspaceId: string; // Added workspaceId
}

export interface UserRecord {
  id: string;
  activeWorkspaceId: string;
  onboardingCompleted: boolean;
  createdAt: number;
}

export interface ProfileRecord {
  id: string; // Same as userId
  displayName: string;
  avatarUrl?: string; // or emoji
  bio?: string;
  updatedAt: number;
}

export interface WorkspaceRecord {
  id: string;
  userId: string;
  name: string;
  theme?: string;
  layout?: Record<string, any>; // JSON structure for layout
  createdAt: number;
  lastUsedAt: number;
}

export interface VsDeskDB extends DBSchema {
  bookmarks: {
    key: string;
    value: BookmarkRecord;
    indexes: {
      parentId: string;
      workspaceId: string;
    };
  };
  users: {
    key: string;
    value: UserRecord;
  };
  profiles: {
    key: string;
    value: ProfileRecord;
  };
  workspaces: {
    key: string;
    value: WorkspaceRecord;
    indexes: {
      userId: string;
    };
  };
  themes: {
    key: string;
    value: ThemeRecord;
  };
}

let dbPromise: Promise<IDBPDatabase<VsDeskDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<VsDeskDB>> {
  if (!dbPromise) {
    dbPromise = openDB<VsDeskDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        // v1: Bookmarks
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains('bookmarks')) {
            const bookmarkStore = db.createObjectStore('bookmarks', {
              keyPath: 'id',
            });
            bookmarkStore.createIndex('parentId', 'parentId');
          }
        }

        // v2: Users, Profiles, Workspaces
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('users')) {
            db.createObjectStore('users', { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains('profiles')) {
            db.createObjectStore('profiles', { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains('workspaces')) {
            const workspaceStore = db.createObjectStore('workspaces', { keyPath: 'id' });
            workspaceStore.createIndex('userId', 'userId');
          }

          // Add workspaceId index to bookmarks
          const bookmarkStore = transaction.objectStore('bookmarks');
          if (!bookmarkStore.indexNames.contains('workspaceId')) {
            bookmarkStore.createIndex('workspaceId', 'workspaceId');
          }
        }

        // v3: Themes
        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains('themes')) {
            db.createObjectStore('themes', { keyPath: 'id' });
          }
        }
      },
    });
  }
  return dbPromise;
}
