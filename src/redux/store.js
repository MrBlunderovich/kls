import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { warehouseReducer } from "./warehouseSlice";
import { archiveReducer } from "./archiveSlice";
import { distributorReducer } from "./editDistributorSlice";
import { distributorsReducer } from "./distributorsSlice";
import { productReducer } from "./editProductSlice";
import { profileReducer } from "./profileSlice";
import { optionsReducer } from "./optionsSlice";
import { transactionReducer } from "./transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    warehouse: warehouseReducer,
    distributor: distributorReducer,
    distributors: distributorsReducer,
    product: productReducer,
    archive: archiveReducer,
    profile: profileReducer,
    options: optionsReducer,
    transaction: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "transaction/printOrderById/fulfilled",
          "transaction/printReturnById/fulfilled",
        ],
      },
    }),
});
