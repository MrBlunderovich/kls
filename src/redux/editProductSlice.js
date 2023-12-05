import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";
import showToastLoader from "../utils/showToastLoader";

const name = "product";

export const getProductById = createAsyncThunk(
  `${name}/getProductById`,
  async ({ id, isDefect }) => {
    const suffix = isDefect ? "defect/" : "";
    try {
      const response = await axiosPrivate.get(`/products/${suffix}${id}/`);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const createProduct = createAsyncThunk(
  `${name}/createProduct`,
  async (formData) => {
    try {
      const response = await showToastLoader(
        axiosPrivate.post(`/products/`, formData),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error.request?.responseText || error);
    }
  },
);

export const moveProductbyId = createAsyncThunk(
  `${name}/moveProductbyId`,
  async ({ id, targetCondition }) => {
    try {
      if (targetCondition === "defect") {
        await showToastLoader(
          axiosPrivate.post(`/products/move_normal_to_defect/${id}/`),
        );
      } else {
        await showToastLoader(
          axiosPrivate.post(`/products/move_defect_to_normal/${id}/`),
        );
      }
      return;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const updateProductById = createAsyncThunk(
  `${name}/updateProductById`,
  async ({ id, formData, isDefect }) => {
    const suffix = isDefect ? "defect/" : "";

    try {
      const response = await showToastLoader(
        axiosPrivate.put(`/products/${suffix}${id}/`, formData),
      );

      return response.data;
    } catch (error) {
      return Promise.reject(error.request?.responseText || error);
    }
  },
);

export const archiveProductById = createAsyncThunk(
  `${name}/archiveProductById`,
  async ({ id, isDefect }) => {
    const suffix = isDefect ? "defect/" : "";
    try {
      const response = await showToastLoader(
        axiosPrivate.delete(`/products/${suffix}${id}/`),
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

const productSlice = createSlice({
  name,
  initialState,
  reducers: {
    clearData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.originalData = action.payload;
      });
  },
});

export const productActions = productSlice.actions;
export const productReducer = productSlice.reducer;
