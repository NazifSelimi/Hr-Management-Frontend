import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import { Department } from "../../components/types";

interface DepartmentsState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentsState = {
  departments: [],
  loading: false,
  error: null,
};

// Thunk for fetching all departments (for listing purposes)
export const fetchDepartments = createAsyncThunk<Department[]>(
  "departments/fetchDepartments",
  async () => {
    const response = await axiosInstance.get("/employee-departments");
    return response.data;
  }
);

// Thunk for fetching a single department by ID (for detailed view)
export const fetchDepartmentById = createAsyncThunk<Department, string>(
  "departments/fetchDepartmentById",
  async (id: string) => {
    const response = await axiosInstance.get(`/view-department/${id}`);
    return response.data;
  }
);

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching all departments
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.departments = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch departments";
      })

      // Handle fetching a specific department by ID
      .addCase(fetchDepartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action: PayloadAction<Department>) => {
        const department = action.payload;
        // Update or add the department to the list
        const existingDepartment = state.departments.find((d) => d.id === department.id);
        if (existingDepartment) {
          Object.assign(existingDepartment, department); // Update if found
        } else {
          state.departments.push(department); // Add if not found
        }
        state.loading = false;
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch department details";
      });
  },
});

export default departmentsSlice.reducer;
