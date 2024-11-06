import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from "../../components/types";
import axiosInstance from '../../services/axiosInstance';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
};

const userAdminSlice = createSlice({
  name: "userAdmin",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details";
      });
  },
});

export const fetchUserDetails = createAsyncThunk(
  "userAdmin/fetchUserDetails",
  async (id: string) => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  }
);

export const { updateUser } = userAdminSlice.actions;

export default userAdminSlice.reducer;
