import { type DBSchema, type IDBPDatabase, openDB } from 'idb';
import { DB_NAME, DB_VERSION } from './config';

export interface BookmarkRecord {
  id: string;
  label: string;
  type: 'folder' | 'link';
  url?: string;
  parentId: string | null;
  sortOrder: number;
  collapsed?: boolean;
}

export interface VsDeskDB extends DBSchema {
  bookmarks: {
    key: string;
    value: BookmarkRecord;
    indexes: {
      parentId: string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<VsDeskDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<VsDeskDB>> {
  if (!dbPromise) {
    dbPromise = openDB<VsDeskDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const bookmarkStore = db.createObjectStore('bookmarks', {
          keyPath: 'id',
        });
        bookmarkStore.createIndex('parentId', 'parentId');
      },
    });
  }
  return dbPromise;
}
