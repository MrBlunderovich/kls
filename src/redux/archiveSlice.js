import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";
import showToastLoader from "../utils/showToastLoader";

const name = "archive";

export const fetchArchiveItems = createAsyncThunk(
  `${name}/fetchArchiveItems`,
  async (entity) => {
    try {
      const response = await axiosPrivate.get(`/${entity}/archive/`);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const restoreItemById = createAsyncThunk(
  `${name}/restoreItemById`,
  async ({ entity, id, condition }) => {
    const targetArchive =
      condition === "normal" ? "archive-normal" : "archive-defect";
    try {
      const response = await showToastLoader(
        axiosPrivate.delete(`/${entity}/${targetArchive}/${id}/`),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

const initialState = {
  items: [],
  isLoading: false,
};

export const archiveSlice = createSlice({
  name,
  initialState,
  reducers: {
    clearData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArchiveItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchArchiveItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchArchiveItems.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const archiveReducer = archiveSlice.reducer;
export const archiveActions = archiveSlice.actions;
