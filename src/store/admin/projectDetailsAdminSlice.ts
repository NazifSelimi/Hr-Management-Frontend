import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../services/axiosInstance";
import { Project } from "../../components/types";

interface ProjectState {
  project: Project | null;
  loading: boolean;
}

const initialState: ProjectState = {
  project: null,
  loading: false,
};

// Thunk to fetch project data
export const fetchProject = createAsyncThunk('project/fetchProject', async (id: string) => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data;
});

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProject: (state) => {
      state.project = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loading = false;
      })
      .addCase(fetchProject.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearProject } = projectSlice.actions;
export default projectSlice.reducer;
