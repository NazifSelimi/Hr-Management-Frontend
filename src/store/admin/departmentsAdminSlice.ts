import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Department } from "../../components/types";
import { fetchDepartmentsApi, deleteDepartmentApi, updateDepartmentApi } from "../../apiService";

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

export const fetchDepartments = createAsyncThunk('departments/fetch', async () => {
  return await fetchDepartmentsApi();
});

export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id: string) => {
    await deleteDepartmentApi(id);
    return id;
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, name }: { id: string; name: string }) => {
    await updateDepartmentApi(id, { name });
    return { id, name };
  }
);

const departmentAdminSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.departments = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDepartments.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load departments';
      })
      .addCase(deleteDepartment.fulfilled, (state, action: PayloadAction<string>) => {
        state.departments = state.departments.filter((dept) => dept.id !== action.payload);
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const { id, name } = action.payload;
        const index = state.departments.findIndex((dept) => dept.id === id);
        if (index !== -1) {
          state.departments[index].name = name;
        }
      });
  },
});

export default departmentAdminSlice.reducer;
