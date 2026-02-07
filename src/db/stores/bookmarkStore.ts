import { type BookmarkRecord, getDB } from '../connection';

export class BookmarkStore {
  async getAll(): Promise<BookmarkRecord[]> {
    const db = await getDB();
    return db.getAll('bookmarks');
  }

  async put(record: BookmarkRecord): Promise<void> {
    const db = await getDB();
    await db.put('bookmarks', record);
  }

  async putMany(records: BookmarkRecord[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('bookmarks', 'readwrite');
    await Promise.all([
      ...records.map((r) => tx.store.put(r)),
      tx.done,
    ]);
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('bookmarks', id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('bookmarks', 'readwrite');
    await Promise.all([
      ...ids.map((id) => tx.store.delete(id)),
      tx.done,
    ]);
  }

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('bookmarks');
  }
}

export const bookmarkStore = new BookmarkStore();
