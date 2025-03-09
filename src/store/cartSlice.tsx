import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartState, MenuItem } from "../interfaces/interface";

const initialState: cartState = {
  items: [],
};
// Definierar det initiala tillståndet för kundvagnen, som är en tom lista med objekt

const cartSlice = createSlice({
  name: "cart",
  // Namnger denna slice "cart"
  initialState,
  // Sätter initialState som det initiala tillståndet för denna slice
  reducers: {
    addItemToCart: (state, action: PayloadAction<MenuItem>) => {
      // Definierar en reducer för att lägga till en vara i kundvagnen
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      // Kollar om varan redan finns i kundvagnen

      if (existingItem) {
        existingItem.quantity += 1;
        // Om varan redan finns, ökar kvantiteten med 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
        // Om varan inte finns, läggs den till i kundvagnen med kvantiteten 1
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      // Definierar en reducer för att ta bort en vara från kundvagnen
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Filtrerar bort varan med det specifika id:t från kundvagnen
    },
    decreaseItemQuantity: (state, action: PayloadAction<string>) => {
      // Definierar en reducer för att minska kvantiteten av en vara i kundvagnen
      const item = state.items.find((item) => item.id === action.payload);
      // Hittar varan i kundvagnen

      if (item) {
        item.quantity -= 1;
        // Minskar kvantiteten med 1
        if (item.quantity === 0) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
          // Om kvantiteten blir 0, tas varan bort från kundvagnen
        }
      }
    },
  },
});

export const { addItemToCart, removeItemFromCart, decreaseItemQuantity } =
  cartSlice.actions;
// Exporterar de definierade actions för att kunna användas i komponenter

export default cartSlice.reducer;
// Exporterar reducern för att kunna inkluderas i store
