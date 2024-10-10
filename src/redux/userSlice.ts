// src/redux/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserProfile, fetchUserProfile } from "../apiService";
import {User} from "../components/types"

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUserProfileThunk = createAsyncThunk(
  "user/fetchUserProfile",
  async () => {
    const response = await fetchUserProfile();
    return response;
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "user/updateUserProfile",
  async ({ id, values }: { id: string; values: User }) => {
    const response = await updateUserProfile(id, values);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user profile.";
      })
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user profile.";
      });
  },
});

export default userSlice.reducer;
