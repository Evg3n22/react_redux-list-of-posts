import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- Author Slice ---
export interface AuthorState {
  id: number | null;
}

const initialAuthorState: AuthorState = { id: null };

export const authorSlice = createSlice({
  name: 'author',
  initialState: initialAuthorState,
  reducers: {
    setAuthor: (state, action: PayloadAction<number | null>) => {
      /* eslint-disable no-param-reassign */
      state.id = action.payload;
      /* eslint-enable no-param-reassign */
    },
  },
});

// --- Selected Post Slice ---
interface SelectedPostState {
  id: number | null;
}

const initialSelectedPostState: SelectedPostState = { id: null };

export const selectedPostSlice = createSlice({
  name: 'selectedPost',
  initialState: initialSelectedPostState,
  reducers: {
    /* eslint-disable no-param-reassign */
    setSelectedPost: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    clearSelectedPost: state => {
      state.id = null;
    },
    /* eslint-enable no-param-reassign */
  },
});

export default authorSlice.reducer;
export const { setAuthor } = authorSlice.actions;
