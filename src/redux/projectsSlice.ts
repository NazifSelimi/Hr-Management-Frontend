// src/redux/projectsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { Project } from "../components/types";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

// Thunk for fetching projects
export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async () => {
    const response = await axiosInstance.get("/employee-projects");
    return response.data;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.projects = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
      });
  },
});

export default projectsSlice.reducer;
