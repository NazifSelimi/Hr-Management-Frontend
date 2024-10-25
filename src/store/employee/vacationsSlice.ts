import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchEmployeeVacation } from "../../apiService"; 
import { Vacation } from "../../components/types";

interface VacationsState {
  vacations: Vacation[];
  loading: boolean;
  error: string | null;
}

const initialState: VacationsState = {
  vacations: [],
  loading: false,
  error: null,
};

export const fetchVacations = createAsyncThunk<Vacation[], void>(
  "vacations/fetchVacations",
  async () => {
    const response = await fetchEmployeeVacation(); 
    return response; 
  }
);

const vacationsSlice = createSlice({
  name: "vacations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVacations.fulfilled, (state, action: PayloadAction<Vacation[]>) => {
        state.loading = false;
        state.vacations = action.payload;
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch vacations";
      });
  },
});

export default vacationsSlice.reducer;
