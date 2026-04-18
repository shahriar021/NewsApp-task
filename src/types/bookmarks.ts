export interface BookmarkState {
  bookmarks: number[];
  toggleBookmark: (id: number) => Promise<void>;
  loadBookmarks: () => Promise<void>;
  isBookmarked: (id: number) => boolean;
  clearBookmarks: () => Promise<void>;
}