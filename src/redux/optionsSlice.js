import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";
import { ENDPOINTS } from "../common/constants";

const name = "options";

export const fetchOptions = createAsyncThunk(
  `${name}/fetchOptions`,
  async () => {
    try {
      const response = await axiosPrivate.get(ENDPOINTS.categoryOptions);
      return response.data;
    } catch (error) {
      console.warn(error);
    }
  },
);

const initialState = {
  categories: [],
};

export const optionsSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOptions.fulfilled, (state, action) => {
      state.categories = action.payload.map((item) => ({
        label: item.title,
        value: item.title,
      }));
    });
  },
});

export const optionsReducer = optionsSlice.reducer;
export const optionsActions = optionsSlice.actions;
