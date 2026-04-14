/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Comment, CommentData } from '../../types/Comment';
import * as commentsApi from '../../api/comments';

type CommentsState = {
  loaded: boolean;
  hasError: boolean;
  // Зберігаємо коментарі у форматі { [postId]: Comment[] }
  items: Record<number, Comment[]>;
};

const initialState: CommentsState = {
  loaded: false,
  hasError: false,
  items: {},
};

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  (postId: number) => commentsApi.getPostComments(postId),
);

export const addComment = createAsyncThunk(
  'comments/add',
  (data: { postId: number; comment: CommentData }) =>
    commentsApi.createComment({ ...data.comment, postId: data.postId }),
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async ({ commentId, postId }: { commentId: number; postId: number }) => {
    await commentsApi.deleteComment(commentId);

    return { commentId, postId };
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch
      .addCase(fetchComments.pending, state => {
        state.loaded = false;
        state.hasError = false;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loaded = true;
        state.items[action.meta.arg] = action.payload;
      })
      .addCase(fetchComments.rejected, state => {
        state.loaded = true;
        state.hasError = true;
      })
      // Add
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId } = action.payload; // сервер поверне об'єкт з postId

        if (state.items[postId]) {
          state.items[postId].push(action.payload);
        }
      })
      // Delete (Optimistic update можна реалізувати в pending, але тут зробимо простіше)
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, postId } = action.payload;

        if (state.items[postId]) {
          state.items[postId] = state.items[postId].filter(
            c => c.id !== commentId,
          );
        }
      });
  },
});

export default commentsSlice.reducer;
