import type { ThemeRecord } from '../../theme/types';
import { getDB } from '../connection';

export class ThemeStore {
  async getAll(): Promise<ThemeRecord[]> {
    const db = await getDB();
    return db.getAll('themes');
  }

  async get(id: string): Promise<ThemeRecord | undefined> {
    const db = await getDB();
    return db.get('themes', id);
  }

  async put(record: ThemeRecord): Promise<void> {
    const db = await getDB();
    await db.put('themes', record);
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('themes', id);
  }

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('themes');
  }
}

export const themeStore = new ThemeStore();
