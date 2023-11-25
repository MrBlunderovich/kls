import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";

const name = "product";

export const getProductById = createAsyncThunk(
  `${name}/getProductById`,
  async (id) => {
    try {
      const response = await axiosPrivate.get(`/products/${id}/`);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const postProduct = createAsyncThunk(
  `${name}/postProduct`,
  async (formData) => {
    try {
      const response = await axiosPrivate.post(`/products/`, formData);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const updateProductById = createAsyncThunk(
  `${name}/updateProductById`,
  async ({ id, formData }) => {
    try {
      const response = await axiosPrivate.put(`/products/${id}/`, formData);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const archiveProductById = createAsyncThunk(
  `${name}/archiveProductById`,
  async (id) => {
    try {
      const response = await axiosPrivate.delete(`/products/${id}/`);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

const initialState = {
  data: null,
  error: null,
  isLoading: false,
};

const productSlice = createSlice({
  name,
  initialState,
  reducers: {
    /* setData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    }, */
    clearData: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const productActions = productSlice.actions;
export const productReducer = productSlice.reducer;
