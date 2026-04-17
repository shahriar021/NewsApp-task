import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookmarkState {
  items: any[];
}

const initialState: BookmarkState = {
  items: [],
};

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark(state, action: PayloadAction<any>) {
      state.items.push(action.payload);
    },
    removeBookmark(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addBookmark, removeBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
