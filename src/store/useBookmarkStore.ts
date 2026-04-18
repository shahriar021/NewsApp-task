import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookmarkState } from '../types/bookmarks';

const STORAGE_KEY = 'news-bookmarks';

const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  
  loadBookmarks: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('📖 Loading bookmarks from AsyncStorage:', saved);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        set({ bookmarks: parsed });
        console.log('Bookmarks loaded:', parsed.length, 'items');
      } else {
        console.log('No saved bookmarks found');
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  },
  
  toggleBookmark: async (id) => {
    try {
      const currentBookmarks = get().bookmarks;
      const exists = currentBookmarks.includes(id);
      
      let newBookmarks;
      if (exists) {
        newBookmarks = currentBookmarks.filter((bid) => bid !== id);
        console.log('Removed bookmark:', id);
      } else {
        newBookmarks = [...currentBookmarks, id];
        console.log('Added bookmark:', id);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
      console.log('Saved to AsyncStorage:', newBookmarks.length, 'bookmarks');
      
      set({ bookmarks: newBookmarks });
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  },
  
  isBookmarked: (id) => {
    return get().bookmarks.includes(id);
  },
  
  clearBookmarks: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ bookmarks: [] });
      console.log('All bookmarks cleared');
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
    }
  },
}));

export { useBookmarkStore };