import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//import { axiosDummy } from "../api/axiosDummy";

const name = "options";

/* export const fetchOptions = createAsyncThunk(
  `${name}/fetchOptions`,
  async () => {
    try {
      const response = await axiosDummy.get(`/options`);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
); */

const initialState = {
  options: {
    category: [{ value: "", label: "---" }],
    unit: [{ value: "", label: "---" }],
    region: [{ value: "", label: "---" }],
  },
};

export const optionsSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* builder.addCase(fetchOptions.fulfilled, (state, action) => {
      state.options = action.payload;
    });
    builder.addCase(fetchOptions.rejected, () => {
      console.warn("Failed to fetch options");
    }); */
  },
});

export const optionsReducer = optionsSlice.reducer;
export const optionsActions = optionsSlice.actions;
