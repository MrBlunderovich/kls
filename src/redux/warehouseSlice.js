import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";

const name = "warehouse";

export const getNormalProducts = createAsyncThunk(
  `${name}/getNormalProducts`,
  async (queryParams) => {
    try {
      const response = await axiosPrivate.get(`/products/`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const getDefectProducts = createAsyncThunk(
  `${name}/getDefectProducts`,
  async (queryParams) => {
    try {
      const response = await axiosPrivate.get(`/products/defect/`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

const initialState = {
  search: "",
  category: "",
  state: "normal",
  items: [],
  isLoading: false,
};

export const warehouseSlice = createSlice({
  name,
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setCondition: (state, action) => {
      state.state = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    clearData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNormalProducts.pending, handlePending);
    builder.addCase(getNormalProducts.fulfilled, handleFulfilled);
    builder.addCase(getDefectProducts.pending, handlePending);
    builder.addCase(getDefectProducts.fulfilled, handleFulfilled);
  },
});

function handlePending(state) {
  state.isLoading = true;
}

function handleFulfilled(state, action) {
  state.isLoading = false;
  state.items = action.payload;
}

export const warehouseReducer = warehouseSlice.reducer;
export const warehouseActions = warehouseSlice.actions;
