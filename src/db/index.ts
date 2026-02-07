export { DB_NAME, DB_VERSION, STORE_NAMES } from './config';
export { getDB } from './connection';
export type { BookmarkRecord, VsDeskDB } from './connection';
export {
  getAllBookmarks,
  putBookmark,
  putBookmarks,
  deleteBookmark,
  deleteBookmarks,
  clearBookmarks,
} from './stores/bookmarkStore';
