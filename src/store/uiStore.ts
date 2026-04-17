import { create } from 'zustand';
import { SortOrder } from '../types';

interface UIState {
  sortOrder: SortOrder;
  scrollOffset: number;
  searchQuery: string;

  setSortOrder: (order: SortOrder) => void;
  setScrollOffset: (offset: number) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // state
  sortOrder: 'score',
  scrollOffset: 0,
  searchQuery: '',

  // actions
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setScrollOffset: (scrollOffset) => set({ scrollOffset }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));