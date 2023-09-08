import { configureStore } from "@reduxjs/toolkit";
import customSliceReducer from "./customSlice"

export const store = configureStore({
    reducer: {
      customSlice:customSliceReducer,
     
    },
  });