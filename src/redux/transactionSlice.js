import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../api/axiosPrivate";
import showToastLoader from "../utils/showToastLoader";

const name = "transaction";

export const getDistributorById = createAsyncThunk(
  `${name}/getDistributorById`,
  async (id) => {
    try {
      const response = await axiosPrivate.get(`/distributors/${id}/`);
      return response.data;
    } catch (error) {
      console.warn(error);
      return Promise.reject(error);
    }
  },
);

export const getWarehouseItems = createAsyncThunk(
  `${name}/getWarehouseItems`,
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

export const getOrdersById = createAsyncThunk(
  `${name}/getOrdersById`,
  async ({ id, queryParams }) => {
    try {
      const response = await axiosPrivate.get(
        `transactions/distributor/${id}`,
        {
          params: queryParams,
        },
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const postOrderById = createAsyncThunk(
  `${name}/postOrderById`,
  async (data) => {
    try {
      const response = await showToastLoader(
        axiosPrivate.post(`/transactions/invoices/`, data),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error.request?.responseText || error);
    }
  },
);

export const printOrderById = createAsyncThunk(
  `${name}/printOrderById`,
  async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/transactions/generate_pdf/${id}/`,
        { responseType: "blob" },
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error.request?.responseText || error);
    }
  },
);

const initialState = {
  isLoading: false,
  invoiceNumber: null,
  search: "",
  category: "",
  orderNumber: "",
  distributor: {
    name: "Загрузка...",
    inn: "Загрузка...",
    region: "Загрузка...",
    contact: "",
    contact2: "",
  },
  source: [],
  target: [],
  hoverRowId: "",
};

export const transactionSlice = createSlice({
  name,
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    updateSource: (state) => {
      const target = state.target;
      const source = state.source;
      let anyMatches = false;
      target.forEach((item) => {
        const id = item.id;
        const sourceRecord = source.find((record) => record.id === id);
        if (sourceRecord) {
          anyMatches = true;
          sourceRecord.quantity = item.maxQuantity - item.quantity;
        }
      });
      if (!anyMatches) {
        return state;
      }
    },
    addItemToTarget: (state, action) => {
      const record = action.payload;
      const target = state.target;
      const existingRecord = target.find((item) => item.id === record.id);
      if (!existingRecord) {
        target.push({
          ...record,
          maxQuantity: record.quantity,
          quantity: 1,
          state: "normal",
        });
      } else {
        if (existingRecord.quantity < existingRecord.maxQuantity) {
          existingRecord.quantity++;
        } else {
          return state;
        }
      }
    },
    removeItemFromTarget: (state, action) => {
      const { id } = action.payload;
      state.target = state.target.filter((targetItem) => {
        if (targetItem.id === id) {
          state.source.find((sourceItem) => sourceItem.id === id).quantity =
            targetItem.maxQuantity;
          return false;
        }
        return true;
      });
    },
    setQuantity: (state, action) => {
      const { id, value } = action.payload;
      const item = state.target.find((item) => item.id === id);
      if (value <= item.maxQuantity) {
        item.quantity = value;
      } else {
        item.quantity = item.maxQuantity;
      }
    },
    toggleCondition: (state, action) => {
      const id = action.payload.id;
      const currentCondition = action.payload.state;
      const isDefect = currentCondition === "defect";
      state.target.find((item) => item.id === id).state = isDefect
        ? "normal"
        : "defect";
    },
    setHoverRowId: (state, action) => {
      state.hoverRowId = action.payload;
    },
    setOrderNumber: (state, action) => {
      state.orderNumber = action.payload;
    },
    clearData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDistributorById.fulfilled, (state, action) => {
        state.distributor = action.payload;
      })

      .addCase(getOrdersById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrdersById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.source = action.payload;
      })

      .addCase(getWarehouseItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWarehouseItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.source = action.payload;
      });
    /* .addCase(postOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoiceNumber = action.payload.id;
      }); */
  },
});

export const transactionReducer = transactionSlice.reducer;
export const transactionActions = transactionSlice.actions;
