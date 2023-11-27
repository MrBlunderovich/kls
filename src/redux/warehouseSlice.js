import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";

const name = "warehouse";

export const fetchWarehouseItems = createAsyncThunk(
  `${name}/fetchWarehouseItems`,
  async (queryParams) => {
    try {
      const response = await axiosPrivate.get(`/products/?limit=10000`, {
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
  error: null,
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
    builder.addCase(fetchWarehouseItems.pending, (state, action) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(fetchWarehouseItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.items = action.payload;
    });
    builder.addCase(fetchWarehouseItems.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const warehouseReducer = warehouseSlice.reducer;
export const warehouseActions = warehouseSlice.actions;
