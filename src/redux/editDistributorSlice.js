import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";
import showToastLoader from "../utils/showToastLoader";

const name = "distributor";

export const getDistributorById = createAsyncThunk(
  `${name}/getDistributorById`,
  async (id) => {
    try {
      const response = await axiosPrivate.get(`/distributors/${id}/`);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const createDistributor = createAsyncThunk(
  `${name}/createDistributor`,
  async (formData) => {
    try {
      const response = await showToastLoader(
        axiosPrivate.post(`/distributors/`, formData),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error.request?.responseText || error);
    }
  },
);

export const editDistributorById = createAsyncThunk(
  `${name}/editDistributorById`,
  async ({ id, formData }) => {
    try {
      const response = await showToastLoader(
        axiosPrivate.put(`/distributors/${id}/`, formData),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error.request?.responseText || error);
    }
  },
);

export const archiveDistributorById = createAsyncThunk(
  `${name}/archiveDistributorById`,
  async (id) => {
    try {
      const response = await showToastLoader(
        axiosPrivate.delete(`/distributors/${id}/`),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

const initialState = {
  originalData: null,
  error: null,
  isLoading: false,
};

export const distributorSlice = createSlice({
  name,
  initialState,
  reducers: {
    clearData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDistributorById.pending, (state) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(getDistributorById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.originalData = action.payload;
    });
    builder.addCase(getDistributorById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const distributorReducer = distributorSlice.reducer;
export const distributorActions = distributorSlice.actions;
