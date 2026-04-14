/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

type UsersState = {
  items: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

// eslint-disable-next-line prettier/prettier
export const fetchUsers = createAsyncThunk<User[], void, {rejectValue: string}>(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');

      if (!res.ok) {
        throw new Error('Server Error');
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  });

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    /* eslint-disable no-param-reassign */
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      });
    /* eslint-enable no-param-reassign */
  },
});


export default usersSlice.reducer;
