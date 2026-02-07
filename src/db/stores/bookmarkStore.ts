import { type BookmarkRecord, getDB } from '../connection';

export async function getAllBookmarks(): Promise<BookmarkRecord[]> {
  const db = await getDB();
  return db.getAll('bookmarks');
}

export async function putBookmark(record: BookmarkRecord): Promise<void> {
  const db = await getDB();
  await db.put('bookmarks', record);
}

export async function putBookmarks(records: BookmarkRecord[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('bookmarks', 'readwrite');
  await Promise.all([
    ...records.map((r) => tx.store.put(r)),
    tx.done,
  ]);
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('bookmarks', id);
}

export async function deleteBookmarks(ids: string[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('bookmarks', 'readwrite');
  await Promise.all([
    ...ids.map((id) => tx.store.delete(id)),
    tx.done,
  ]);
}

export async function clearBookmarks(): Promise<void> {
  const db = await getDB();
  await db.clear('bookmarks');
}
