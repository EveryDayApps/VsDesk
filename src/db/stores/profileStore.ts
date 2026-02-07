import { type ProfileRecord, getDB } from '../connection';

export class ProfileStore {
  async getProfile(userId: string): Promise<ProfileRecord | undefined> {
    const db = await getDB();
    return db.get('profiles', userId);
  }

  async save(profile: ProfileRecord): Promise<void> {
    const db = await getDB();
    await db.put('profiles', profile);
  }
}

export const profileStore = new ProfileStore();
