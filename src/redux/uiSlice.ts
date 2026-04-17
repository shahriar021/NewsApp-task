import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sort: 'score' | 'time';
}

const initialState: UiState = {
  sort: 'score',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSort(state) {
      state.sort = state.sort === 'score' ? 'time' : 'score';
    },
    setSort(state, action: PayloadAction<'score' | 'time'>) {
      state.sort = action.payload;
    },
  },
});

export const { toggleSort, setSort } = uiSlice.actions;
export default uiSlice.reducer;
