import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem, MenuState } from "../interfaces/interface";
import { fetchApiKeyFromServer, fetchMenuFromServer } from "../api/api";

// Initialt state
const initialState: MenuState = {
  items: [],
  status: "idle",
  error: null,
  apiKey: localStorage.getItem("apiKey") || null,
  apiKeyStatus: localStorage.getItem("apiKey") ? "succeeded" : "idle",
};

// Thunk för att hämta API-nyckeln
export const fetchApiKey = createAsyncThunk<string, void, { rejectValue: string }>(
  "menu/fetchApiKey",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchApiKeyFromServer();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Thunk för att hämta menyn
export const fetchMenu = createAsyncThunk<{ items: MenuItem[] }, void, { state: { menu: MenuState }; rejectValue: string }>(
  "menu/fetchMenu",
  async (_, { getState, rejectWithValue }) => {
    const apiKey = getState().menu.apiKey;
    if (!apiKey) return rejectWithValue("API key is missing");

    try {
      return await fetchMenuFromServer(apiKey);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Skapa Redux-slice
const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiKey.pending, (state) => { state.apiKeyStatus = "loading"; })
      .addCase(fetchApiKey.fulfilled, (state, action: PayloadAction<string>) => {
        state.apiKey = action.payload;
        state.apiKeyStatus = "succeeded";
      })
      .addCase(fetchApiKey.rejected, (state, action) => {
        state.apiKeyStatus = "failed";
        state.error = action.payload ?? "An unexpected error occurred";
      })

      .addCase(fetchMenu.pending, (state) => { state.status = "loading"; })
      .addCase(fetchMenu.fulfilled, (state, action: PayloadAction<{ items: MenuItem[] }>) => {
        state.items = action.payload.items;
        state.status = "succeeded";
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "An unexpected error occurred";
      });
  },
});

export default menuSlice.reducer;
