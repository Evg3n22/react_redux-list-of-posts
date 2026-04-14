/* eslint-disable no-param-reassign */
// app/slices/postsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserPosts } from '../../api/posts';
import { Post } from '../../types/Post';

export const fetchPosts = createAsyncThunk(
  'posts/fetch',
  async (userId: number) => {
    return getUserPosts(userId);
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [] as Post[],
    loading: false, // ВАЖЛИВО: саме loading, не loaded
    hasError: false,
  },
  reducers: {
    clearPosts: state => {
      state.items = [];
      state.loading = false;
      state.hasError = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.loading = true; // 1. Включаємо лоадер
        state.items = []; // 2. МИТТЄВО видаляємо старі пости
        state.hasError = false;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false; // 3. Вимикаємо лоадер
      })
      .addCase(fetchPosts.rejected, state => {
        state.loading = false;
        state.hasError = true;
      });
  },
});

export const { clearPosts } = postsSlice.actions;
export default postsSlice.reducer;
