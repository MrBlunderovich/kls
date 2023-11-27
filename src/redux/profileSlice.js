import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";
import { axiosDummy } from "../api/axiosDummy";
import yearLimiter from "../utils/yearLimiter";

const name = "profile";

export const getDistributorById = createAsyncThunk(
  `${name}/getDistributorById`,
  async (distributorId, thunkAPI) => {
    try {
      const response = await axiosPrivate.get(`/distributors/${distributorId}`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const fetchItems = createAsyncThunk(
  `${name}/fetchItems`,
  async ({ id, queryParams, target }, thunkAPI) => {
    try {
      const response = await axiosDummy.get(`/distributor/${target}/${id}`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  distributorInfo: {
    name: "Загрузка...",
    inn: "Загрузка...",
    region: "Загрузка...",
    contact: "",
    contact2: "",
  },
  isReturns: false,
  category: "",
  startDate: "",
  endDate: "",
  data: [],
  isLoading: false,
  error: null,
};
export const profileSlice = createSlice({
  name,
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSales: (state, action) => {
      state.isReturns = action.payload === "return" ? true : false;
    },
    setStartDate: (state, action) => {
      state.startDate = yearLimiter(action.payload);
    },
    setEndDate: (state, action) => {
      state.endDate = yearLimiter(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getDistributorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDistributorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.distributorInfo = action.payload;
      })
      .addCase(getDistributorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || "Не удалось загрузить данные о дистрибьюторе";
      });

    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Не удалось загрузить историю";
      });
  },
});

export const profileReducer = profileSlice.reducer;
export const profileActions = profileSlice.actions;
