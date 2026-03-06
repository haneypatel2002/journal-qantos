import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userAPI } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  id: string | null;
  name: string;
  streakCount: number;
  lastEntryDate: string | null;
  entryCount: number;
  moodDistribution: Array<{ _id: string; count: number }>;
  isOnboarded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: null,
  name: '',
  streakCount: 0,
  lastEntryDate: null,
  entryCount: 0,
  moodDistribution: [],
  isOnboarded: false,
  loading: false,
  error: null,
};

export const createUser = createAsyncThunk(
  'user/create',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await userAPI.create(name);
      await AsyncStorage.setItem('userId', response.data._id);
      await AsyncStorage.setItem('userName', response.data.name);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userAPI.get(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const loadStoredUser = createAsyncThunk(
  'user/loadStored',
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      if (userId && userName) {
        return { id: userId, name: userName };
      }
      return null;
    } catch (error: any) {
      return rejectWithValue('Failed to load stored user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.id = null;
      state.name = '';
      state.isOnboarded = false;
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('userName');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload._id;
        state.name = action.payload.name;
        state.streakCount = action.payload.streakCount || 0;
        state.isOnboarded = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.id = action.payload._id;
        state.name = action.payload.name;
        state.streakCount = action.payload.streakCount || 0;
        state.lastEntryDate = action.payload.lastEntryDate;
        state.entryCount = action.payload.entryCount || 0;
        state.moodDistribution = action.payload.moodDistribution || [];
        state.isOnboarded = true;
      })
      .addCase(loadStoredUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.id = action.payload.id;
          state.name = action.payload.name;
          state.isOnboarded = true;
        }
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
