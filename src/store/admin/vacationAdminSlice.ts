import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import { Vacation } from "../../components/types"

interface VacationState {
  vacations: Vacation[];
  loading: boolean;
  error: string | null;
}

const initialState: VacationState = {
  vacations: [],
  loading: false,
  error: null,
};

// Async thunk to fetch vacations
export const fetchVacations = createAsyncThunk(
  "vacations/fetchVacations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/vacation");
      return data;
    } catch (error: any) {
    //   return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update vacation status
export const updateVacationStatus = createAsyncThunk(
  "vacations/updateVacationStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.patch(`/vacation/${id}`, {
        status,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const vacationSlice = createSlice({
  name: "vacations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch vacations
      .addCase(fetchVacations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacations.fulfilled, (state, action) => {
        state.vacations = action.payload;
        state.loading = false;
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update vacation status
      .addCase(updateVacationStatus.fulfilled, (state, action) => {
        const updatedVacation = action.payload;
        state.vacations = state.vacations.map((vacation) =>
          vacation.id === updatedVacation.id ? updatedVacation : vacation
        );
      })
      .addCase(updateVacationStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default vacationSlice.reducer;
