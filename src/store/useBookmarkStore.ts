import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'news-bookmarks';

const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  
  // Load bookmarks from AsyncStorage
  loadBookmarks: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('📖 Loading bookmarks from AsyncStorage:', saved);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        set({ bookmarks: parsed });
        console.log('✅ Bookmarks loaded:', parsed.length, 'items');
      } else {
        console.log('No saved bookmarks found');
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  },
  
  // Toggle bookmark and save
  toggleBookmark: async (id) => {
    try {
      const currentBookmarks = get().bookmarks;
      const exists = currentBookmarks.includes(id);
      
      let newBookmarks;
      if (exists) {
        newBookmarks = currentBookmarks.filter((bid) => bid !== id);
        console.log('🔖 Removed bookmark:', id);
      } else {
        newBookmarks = [...currentBookmarks, id];
        console.log('🔖 Added bookmark:', id);
      }
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
      console.log('💾 Saved to AsyncStorage:', newBookmarks.length, 'bookmarks');
      
      // Update state
      set({ bookmarks: newBookmarks });
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  },
  
  // Check if bookmarked
  isBookmarked: (id) => {
    return get().bookmarks.includes(id);
  },
  
  // Clear all bookmarks
  clearBookmarks: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ bookmarks: [] });
      console.log('🗑️ All bookmarks cleared');
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
    }
  },
}));

export { useBookmarkStore };