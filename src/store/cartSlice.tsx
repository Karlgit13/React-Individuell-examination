import { createSlice, PayloadAction } from "@reduxjs/toolkit"; // Importerar nödvändiga funktioner från Redux Toolkit
import { cartState, MenuItem } from "../interfaces/interface"; // Importerar typer från en annan fil

// Definierar initialt tillstånd för kundvagnen
const initialState: cartState = {
  items: [], // En tom lista med varor
};

// Skapar en slice för kundvagnen med hjälp av createSlice
const cartSlice = createSlice({
  name: "cart", // Namn på slicen
  initialState, // Initialt tillstånd
  reducers: {
    // Reducer för att lägga till en vara i kundvagnen
    addItemToCart: (state, action: PayloadAction<MenuItem>) => {
      // Kollar om varan redan finns i kundvagnen
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // Om varan redan finns, öka kvantiteten
        existingItem.quantity += 1;
      } else {
        // Om varan inte finns, lägg till den med kvantitet 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Reducer för att ta bort en vara från kundvagnen
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      // Filtrerar bort varan med det givna id:t
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    // Reducer för att minska kvantiteten av en vara i kundvagnen
    decreaseItemQuantity: (state, action: PayloadAction<string>) => {
      // Hittar varan med det givna id:t
      const item = state.items.find((item) => item.id === action.payload);

      if (item) {
        // Minskar kvantiteten
        item.quantity -= 1;
        // Om kvantiteten blir 0, ta bort varan från kundvagnen
        if (item.quantity === 0) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      }
    },
  },
});

// Exporterar actions för att kunna användas i komponenter
export const { addItemToCart, removeItemFromCart, decreaseItemQuantity } =
  cartSlice.actions;

// Exporterar reducer för att kunna användas i store
export default cartSlice.reducer;
