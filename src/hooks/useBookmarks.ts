import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type BookmarkRecord,
  bookmarkStore,
} from '../db';
export interface BookmarkItem {
  id: string;
  label: string;
  type: 'folder' | 'link';
  url?: string;
  children?: BookmarkItem[];
  collapsed?: boolean;
}
const defaultBookmarks: BookmarkItem[] = [
  {
    id: 'root-1',
    label: 'My Bookmarks',
    type: 'folder',
    collapsed: false,
    children: [
      { id: 'demo-1', label: 'GitHub', type: 'link', url: 'https://github.com' },
    ],
  },
];
function generateId(): string {
  return `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
// --- Flat ↔ Tree conversion utilities ---
function buildTree(records: BookmarkRecord[]): BookmarkItem[] {
  const map = new Map<string | null, BookmarkRecord[]>();
  for (const record of records) {
    const parentId = record.parentId;
    if (!map.has(parentId)) {
      map.set(parentId, []);
    }
    map.get(parentId)!.push(record);
  }
  // Sort children within each group by sortOrder
  for (const children of map.values()) {
    children.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  function buildChildren(parentId: string | null): BookmarkItem[] {
    const children = map.get(parentId);
    if (!children) return [];
    return children.map((record) => {
      const item: BookmarkItem = {
        id: record.id,
        label: record.label,
        type: record.type,
      };
      if (record.url) item.url = record.url;
      if (record.type === 'folder') {
        item.children = buildChildren(record.id);
        item.collapsed = record.collapsed ?? false;
      }
      return item;
    });
  }
  return buildChildren(null);
}
function flattenTree(
  items: BookmarkItem[],
  workspaceId: string,
  parentId: string | null = null,
): BookmarkRecord[] {
  const records: BookmarkRecord[] = [];
  items.forEach((item, index) => {
    const record: BookmarkRecord = {
      id: item.id,
      label: item.label,
      type: item.type,
      parentId,
      sortOrder: index,
      workspaceId,
    };
    if (item.url) record.url = item.url;
    if (item.type === 'folder') record.collapsed = item.collapsed ?? false;
    records.push(record);
    if (item.children) {
      records.push(...flattenTree(item.children, workspaceId, item.id));
    }
  });
  return records;
}
// Collect all descendant IDs of a record (for recursive delete)
function collectDescendantIds(
  records: BookmarkRecord[],
  parentId: string,
): string[] {
  const ids: string[] = [];
  for (const r of records) {
    if (r.parentId === parentId) {
      ids.push(r.id);
      ids.push(...collectDescendantIds(records, r.id));
    }
  }
  return ids;
}
// --- Hook ---
export function useBookmarks(workspaceId: string = 'default') {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const recordsRef = useRef<BookmarkRecord[]>([]);

  useEffect(() => {
    async function init() {
      try {
        let records = await bookmarkStore.getAll();
        // Filter by workspace - effectively implementing workspace isolation for bookmarks
        records = records.filter(r => r.workspaceId === workspaceId || !r.workspaceId); // weak migration: include if missing

        if (records.length === 0) {
          records = flattenTree(defaultBookmarks, workspaceId);
          await bookmarkStore.putMany(records);
        }
        recordsRef.current = records;
        setBookmarks(buildTree(records));
      } catch (err) {
        console.error('Failed to load bookmarks from IndexedDB:', err);
        setBookmarks(defaultBookmarks);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [workspaceId]);

  const addItem = useCallback(
    (parentId: string | null, label: string, type: 'folder' | 'link', url?: string) => {
      const siblings = recordsRef.current.filter((r) => r.parentId === parentId);
      const sortOrder = siblings.length;
      const record: BookmarkRecord = {
        id: generateId(),
        label,
        type,
        parentId,
        sortOrder,
        workspaceId,
      };
      if (type === 'link' && url) record.url = url;
      if (type === 'folder') record.collapsed = false;

      const newRecords = [...recordsRef.current, record];
      recordsRef.current = newRecords;
      setBookmarks(buildTree(newRecords));
      bookmarkStore.put(record);
    },
    [workspaceId],
  );

  const removeItem = useCallback(
    (id: string) => {
      const descendantIds = collectDescendantIds(recordsRef.current, id);
      const allIdsToRemove = [id, ...descendantIds];
      const idSet = new Set(allIdsToRemove);
      const newRecords = recordsRef.current.filter((r) => !idSet.has(r.id));
      recordsRef.current = newRecords;
      setBookmarks(buildTree(newRecords));
      bookmarkStore.deleteMany(allIdsToRemove);
    },
    [],
  );

  const editItem = useCallback(
    (id: string, label: string, url?: string) => {
      const newRecords = recordsRef.current.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, label };
        if (r.type === 'link') updated.url = url;
        return updated;
      });
      recordsRef.current = newRecords;
      setBookmarks(buildTree(newRecords));
      const record = newRecords.find((r) => r.id === id);
      if (record) bookmarkStore.put(record);
    },
    [],
  );

  const toggleCollapse = useCallback(
    (id: string) => {
      const newRecords = recordsRef.current.map((r) => {
        if (r.id !== id) return r;
        return { ...r, collapsed: !r.collapsed };
      });
      recordsRef.current = newRecords;
      setBookmarks(buildTree(newRecords));
      const record = newRecords.find((r) => r.id === id);
      if (record) bookmarkStore.put(record);
    },
    [],
  );

  return { bookmarks, isLoading, addItem, editItem, removeItem, toggleCollapse };
}
