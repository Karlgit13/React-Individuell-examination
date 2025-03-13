import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem, MenuState } from "../interfaces/interface";
import { fetchApiKeyFromServer, fetchMenuFromServer } from "../api/api";

// Definierar initialt tillstånd för menyn
const initialState: MenuState = {
  items: [], // Lista över menyobjekt
  status: "idle", // Status för menyhämtning (idle, loading, succeeded, failed)
  error: null, // Felmeddelande om något går fel
  apiKey: localStorage.getItem("apiKey") || null, // API-nyckel hämtad från localStorage
  apiKeyStatus: localStorage.getItem("apiKey") ? "succeeded" : "idle", // Status för API-nyckelhämtning
};

// Skapar en asynkron thunk för att hämta API-nyckeln
export const fetchApiKey = createAsyncThunk<
  string, // Typen av värdet som returneras vid framgång
  void, // Typen av argument som skickas till thunk
  { rejectValue: string } // Typen av värdet som returneras vid avslag
>(
  "menu/fetchApiKey", // Namn på thunk
  async (_, { rejectWithValue }) => {
    try {
      return await fetchApiKeyFromServer(); // Försöker hämta API-nyckeln från servern
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error" // Returnerar felmeddelande vid misslyckande
      );
    }
  }
);

// Skapar en asynkron thunk för att hämta menyn
export const fetchMenu = createAsyncThunk<
  { items: MenuItem[] }, // Typen av värdet som returneras vid framgång
  void, // Typen av argument som skickas till thunk
  { state: { menu: MenuState }; rejectValue: string } // Typen av värdet som returneras vid avslag
>(
  "menu/fetchMenu", // Namn på thunk
  async (_, { getState, rejectWithValue }) => {
    const apiKey = getState().menu.apiKey; // Hämtar API-nyckeln från tillståndet
    if (!apiKey) return rejectWithValue("API key is missing"); // Returnerar fel om API-nyckeln saknas

    try {
      return await fetchMenuFromServer(apiKey); // Försöker hämta menyn från servern med API-nyckeln
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error" // Returnerar felmeddelande vid misslyckande
      );
    }
  }
);

// Skapar en slice för menyn med initialt tillstånd och reducerare
const menuSlice = createSlice({
  name: "menu", // Namn på slice
  initialState, // Initialt tillstånd
  reducers: {}, // Reducerare (tom i detta fall)
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiKey.pending, (state) => {
        state.apiKeyStatus = "loading"; // Sätter status till "loading" när API-nyckeln hämtas
      })
      .addCase(
        fetchApiKey.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.apiKey = action.payload; // Uppdaterar API-nyckeln vid framgång
          state.apiKeyStatus = "succeeded"; // Sätter status till "succeeded"
        }
      )
      .addCase(fetchApiKey.rejected, (state, action) => {
        state.apiKeyStatus = "failed"; // Sätter status till "failed" vid misslyckande
        state.error = action.payload ?? "An unexpected error occurred"; // Sparar felmeddelandet
      })
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading"; // Sätter status till "loading" när menyn hämtas
      })
      .addCase(
        fetchMenu.fulfilled,
        (state, action: PayloadAction<{ items: MenuItem[] }>) => {
          state.items = action.payload.items; // Uppdaterar menyobjekten vid framgång
          state.status = "succeeded"; // Sätter status till "succeeded"
        }
      )
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed"; // Sätter status till "failed" vid misslyckande
        state.error = action.payload ?? "An unexpected error occurred"; // Sparar felmeddelandet
      });
  },
});

export default menuSlice.reducer; // Exporterar reduceraren för användning i store
