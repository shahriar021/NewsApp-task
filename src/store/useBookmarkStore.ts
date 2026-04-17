import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

// Initialize MMKV
const storage = new MMKV();

// Create a small wrapper so Zustand can talk to MMKV
const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

interface BookmarkState {
  items: any[];
  addBookmark: (item: any) => void;
  removeBookmark: (id: number) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    set => ({
      items: [],
      addBookmark: item =>
        set(state => ({
          // Only add if it's not already bookmarked
          items: state.items.some(i => i.id === item.id)
            ? state.items
            : [...state.items, item],
        })),
      removeBookmark: id =>
        set(state => ({
          items: state.items.filter(i => i.id !== id),
        })),
    }),
    {
      name: 'bookmark-storage', // Unique name for MMKV key
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
