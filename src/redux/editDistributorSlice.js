import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";
import toastify from "../utils/toastify";

export const getDistributorById = createAsyncThunk(
  "distributor/getDistributorById",
  async (id) => {
    try {
      const response = await toastify(axiosPrivate.get(`/distributors/${id}/`));
      //const response = await axiosPrivate.get(`/distributors/${id}/`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

export const createDistributor = createAsyncThunk(
  "distributor/createDistributor",
  async (formData) => {
    try {
      const response = await axiosPrivate.post(`/distributors/`, formData);
      return response.data;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },
);

export const editDistributorById = createAsyncThunk(
  "distributor/editDistributorById",
  async ({ id, formData }) => {
    try {
      const response = await axiosPrivate.put(`/distributors/${id}/`, formData);
      return response.data;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },
);

export const archiveDistributorById = createAsyncThunk(
  "distributor/archiveDistributorById",
  async (id) => {
    try {
      const response = await axiosPrivate.delete(`/distributors/${id}/`);
      return response.data;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },
);

const initialState = {
  error: null,
  isLoading: false,
};

export const distributorSlice = createSlice({
  name: "distributor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDistributorById.pending, (state, action) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(getDistributorById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getDistributorById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const distributorReducer = distributorSlice.reducer;
export const distributorActions = distributorSlice.actions;
