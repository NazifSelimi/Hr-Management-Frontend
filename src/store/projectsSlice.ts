// src/redux/projectsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";
import { Project } from "../components/types";

interface ProjectsState {
  projects: Project[]; // Array to hold the list of projects
  loading: boolean;     // State to track loading status
  error: string | null; // State to track any errors
}

// Initial state for the projects slice
const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

// Thunk for fetching all projects
export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async () => {
    const response = await axiosInstance.get("/employee-projects");
    return response.data;
  }
);

// Thunk for fetching a single project by ID
export const fetchProjectById = createAsyncThunk<Project, string>(
  "projects/fetchProjectById",
  async (id) => {
    const response = await axiosInstance.get(`/view-project/${id}`);
    return response.data;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {}, // Add synchronous reducers here if needed
  extraReducers: (builder) => {
    // Handle fetchProjects actions
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true; // Set loading to true while fetching
        state.error = null;   // Reset error
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.projects = action.payload; // Store fetched projects
          state.loading = false;            // Set loading to false after fetching
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;                      // Set loading to false on error
        state.error = action.error.message || "Failed to fetch projects"; // Capture error
      })
      // Handle fetchProjectById actions
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true; // Set loading to true while fetching
        state.error = null;   // Reset error
      })
      .addCase(
        fetchProjectById.fulfilled,
        (state, action: PayloadAction<Project>) => {
          // You can add specific logic to handle a single project's state if needed
          state.loading = false; // Set loading to false after fetching
        }
      )
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;                      // Set loading to false on error
        state.error = action.error.message || "Failed to fetch project"; // Capture error
      });
  },
});

export default projectsSlice.reducer;
