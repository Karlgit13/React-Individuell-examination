import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
