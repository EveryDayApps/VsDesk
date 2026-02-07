import { type WorkspaceRecord, getDB } from '../connection';

export class WorkspaceStore {
  async getAll(userId: string): Promise<WorkspaceRecord[]> {
    const db = await getDB();
    return db.getAllFromIndex('workspaces', 'userId', userId);
  }

  async get(workspaceId: string): Promise<WorkspaceRecord | undefined> {
    const db = await getDB();
    return db.get('workspaces', workspaceId);
  }

  async save(workspace: WorkspaceRecord): Promise<void> {
    const db = await getDB();
    await db.put('workspaces', workspace);
  }

  async delete(workspaceId: string): Promise<void> {
    const db = await getDB();
    await db.delete('workspaces', workspaceId);
  }
}

export const workspaceStore = new WorkspaceStore();
