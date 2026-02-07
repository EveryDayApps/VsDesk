import { type UserRecord, getDB } from '../connection';

export class UserStore {
  async getUser(userId: string): Promise<UserRecord | undefined> {
    const db = await getDB();
    return db.get('users', userId);
  }

  async getAll(): Promise<UserRecord[]> {
    const db = await getDB();
    return db.getAll('users');
  }

  async save(user: UserRecord): Promise<void> {
    const db = await getDB();
    await db.put('users', user);
  }

  async exists(): Promise<boolean> {
    const users = await this.getAll();
    return users.length > 0;
  }
}

export const userStore = new UserStore();
