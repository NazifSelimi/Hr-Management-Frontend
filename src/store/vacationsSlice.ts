import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchEmployeeVacation } from '../apiService'; // Adjust the path as needed
import { Vacation } from "../components/types"; // Adjust to match your type definition path

// Define the state interface
interface VacationsState {
  vacations: Vacation[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: VacationsState = {
  vacations: [],
  loading: false,
  error: null,
};

// Thunk for fetching vacations
export const fetchVacations = createAsyncThunk<Vacation[], void>(
  "vacations/fetchVacations",
  async () => {
    const response = await fetchEmployeeVacation(); // Adjust as needed
    return response; // Make sure this matches the Vacation type
  }
);

// Vacations slice
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
