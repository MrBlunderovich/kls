import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";

export const fetchDistributors = createAsyncThunk(
  "distributors/fetchDistributors",
  async (_, thunkAPI) => {
    try {
      const response = await axiosPrivate.get(`/distributors/?limit=10000`);
      return response.data.results;
    } catch (error) {
      console.warn(error);
    }
  },
);

const initialState = {
  distributors: [],
  isLoading: false,
  error: null,
};

export const distributorsSlice = createSlice({
  name: "distributors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDistributors.pending, (state, action) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(fetchDistributors.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.distributors = action.payload;
    });
    builder.addCase(fetchDistributors.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const distributorsReducer = distributorsSlice.reducer;
export const distributorsActions = distributorsSlice.actions;
