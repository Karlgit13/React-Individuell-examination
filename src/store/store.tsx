import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import cartReducer from "./cartSlice";

// Skapar en Redux store med hjälp av configureStore
// Reducers är funktioner som specificerar hur tillståndet (state) ska förändras som svar på åtgärder (actions)
export const store = configureStore({
  // Definierar vilka reducers som ska användas i denna store
  reducer: {
    // menuReducer hanterar tillståndet för menyrelaterade data
    menu: menuReducer,
    // cartReducer hanterar tillståndet för varukorgsrelaterade data
    cart: cartReducer,
  },
});

// Definierar en typ för hela tillståndet i applikationen
// ReturnType<typeof store.getState> hämtar typen av tillståndet som returneras av store.getState
export type RootState = ReturnType<typeof store.getState>;
// Definierar en typ för dispatch-funktionen i applikationen
// typeof store.dispatch hämtar typen av dispatch-funktionen från store
export type AppDispatch = typeof store.dispatch;
