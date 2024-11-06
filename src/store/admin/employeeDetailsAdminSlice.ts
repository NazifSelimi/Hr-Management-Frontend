// src/store/employeeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../services/axiosInstance"
import { User, Project } from "../../components/types";

interface EmployeeState {
  employee: User | null;
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employee: null,
  projects: [],
  loading: false,
  error: null,
};

export const fetchEmployeeDetails = createAsyncThunk(
  'employee/fetchEmployee',
  async (id: string) => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  }
);

export const fetchProjects = createAsyncThunk(
  'employee/fetchProjects',
  async () => {
    const response = await axiosInstance.get<Project[]>('/projects');
    return response.data;
  }
);

export const assignProjects = createAsyncThunk(
  'employee/assignProjects',
  async ({ id, values }: { id: string; values: { project_ids: string[]; role: string } }) => {
    await axiosInstance.post(`/employees/${id}/assign-projects`, values);
    return values.project_ids;
  }
);

const employeeDetailsAdminSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employee details';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(assignProjects.fulfilled, (state, action) => {
        if (state.employee) {
          const assignedProjects = action.payload
            .map((id) => state.projects.find((p) => p.id === id))
            .filter((project): project is Project => project !== undefined); // Filter out undefined values
      
          state.employee.projects.push(...assignedProjects);
        }
      });
  },
});

export const { clearError } = employeeDetailsAdminSlice.actions;
export default employeeDetailsAdminSlice.reducer;
