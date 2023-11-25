import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";

const name = "product";

export const postProduct = createAsyncThunk(
  `${name}/postProduct`,
  async (_, thunkAPI) => {
    try {
      const formData = thunkAPI.getState().product.data;
      const response = await axiosPrivate.post(`/products/`, formData);
      return response.data;
    } catch (error) {
      console.warn(error);
    }
  },
);

export const updateProductById = createAsyncThunk(
  `${name}/updateProductById`,
  async (id, thunkAPI) => {
    try {
      const formData = thunkAPI.getState().product.data;
      const response = await axiosPrivate.put(`/products/${id}/`, formData);
      return response.data;
    } catch (error) {
      console.warn(error);
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
      console.warn(error);
    }
  },
);

export const getProductById = createAsyncThunk(
  `${name}/getProductById`,
  async (id) => {
    try {
      const response = await axiosPrivate.get(`/products/${id}/`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

const defaultData = {
  name: "",
  identification_number: "",
  quantity: "",
  price: "",
  unit: "liter",
  category: "alcohol",
  state: "normal",
};

const initialState = {
  data: defaultData,
};

const productSlice = createSlice({
  name,
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    clearData: (state) => {
      state.data = defaultData;
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
