// nödvändiga imports från redux & interfaces.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartState, MenuItem } from "../interfaces/interface";

// Initialt state för varukorgen defineras.
// items är en tom array där varor kommer att lagras.
const initialState: cartState = {
  items: [],
};

// Redux slice för varukorgen skapas med createSlice.
// namnet på denna slice sätts till "cart".
// InitialState sätts till den tomma varukorgen.
// Reducers innehåller funktioner som hanterar förändringar i varukorgen.
// addItemToCart hanterar att lägga till en vara i varukorgen.
// action.payload innehåller den vara som ska läggas till.
// find metoden används för att kontrollera om varan redan finns.
// om varan inte finns används push metoden för att lägga till varan.
// removeItemFromCart och decreaseItemQuantity fungerar på samma sätt och använder metoderna find & filter.
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<MenuItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    decreaseItemQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);

      if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      }
    },
  },
});

// exporterar reducer-funktionerna för att kunna användas i andra komponenter.
export const { addItemToCart, removeItemFromCart, decreaseItemQuantity } =
  cartSlice.actions;

// exporterar själva reducerfunktionen för att inkluderas i store.
export default cartSlice.reducer;
