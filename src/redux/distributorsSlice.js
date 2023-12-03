import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";

const name = "distributors";

export const fetchDistributors = createAsyncThunk(
  `${name}/fetchDistributors`,
  async () => {
    try {
      const response = await axiosPrivate.get(`/distributors/`);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

const initialState = {
  distributors: [],
  isLoading: false,
};

export const distributorsSlice = createSlice({
  name,
  initialState,
  reducers: {
    clearData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDistributors.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDistributors.fulfilled, (state, action) => {
      state.isLoading = false;
      state.distributors = action.payload;
    });
    builder.addCase(fetchDistributors.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const distributorsReducer = distributorsSlice.reducer;
export const distributorsActions = distributorsSlice.actions;
