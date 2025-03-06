import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem, MenuState } from "../interfaces/interface";
import { fetchApiKeyFromServer, fetchMenuFromServer } from "../api/api";

// Initialt tillstånd för menyn
const initialState: MenuState = {
  items: [], // Lista över menyobjekt
  status: "idle", // Status för menyhämtning (idle, loading, succeeded, failed)
  error: null, // Felmeddelande om något går fel
  apiKey: localStorage.getItem("apiKey") || null, // API-nyckel lagrad i localStorage eller null om den inte finns
  apiKeyStatus: localStorage.getItem("apiKey") ? "succeeded" : "idle", // Status för API-nyckelhämtning
};

// Thunk för att hämta API-nyckeln
export const fetchApiKey = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>(
  "menu/fetchApiKey", // Namn på thunk
  async (_, { rejectWithValue }) => {
    try {
      // Försök att hämta API-nyckeln från servern
      return await fetchApiKeyFromServer();
    } catch (error) {
      // Om ett fel uppstår, returnera ett avvisat värde med felmeddelandet
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Thunk för att hämta menyn
export const fetchMenu = createAsyncThunk<
  { items: MenuItem[] },
  void,
  { state: { menu: MenuState }; rejectValue: string }
>(
  "menu/fetchMenu", // Namn på thunk
  async (_, { getState, rejectWithValue }) => {
    const apiKey = getState().menu.apiKey; // Hämta API-nyckeln från tillståndet
    if (!apiKey) return rejectWithValue("API key is missing"); // Om API-nyckeln saknas, avvisa med ett felmeddelande

    try {
      // Försök att hämta menyn från servern med API-nyckeln
      return await fetchMenuFromServer(apiKey);
    } catch (error) {
      // Om ett fel uppstår, returnera ett avvisat värde med felmeddelandet
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Skapa Redux-slice för menyn
const menuSlice = createSlice({
  name: "menu", // Namn på slice
  initialState, // Initialt tillstånd
  reducers: {}, // Reducers (inga i detta fall)
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiKey.pending, (state) => {
        state.apiKeyStatus = "loading";
      }) // Hantera pending state för fetchApiKey
      .addCase(
        fetchApiKey.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.apiKey = action.payload; // Uppdatera API-nyckeln i tillståndet
          state.apiKeyStatus = "succeeded"; // Uppdatera status till succeeded
        }
      )
      .addCase(fetchApiKey.rejected, (state, action) => {
        state.apiKeyStatus = "failed"; // Uppdatera status till failed
        state.error = action.payload ?? "An unexpected error occurred"; // Sätt felmeddelandet
      })

      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
      }) // Hantera pending state för fetchMenu
      .addCase(
        fetchMenu.fulfilled,
        (state, action: PayloadAction<{ items: MenuItem[] }>) => {
          state.items = action.payload.items; // Uppdatera menyobjekten i tillståndet
          state.status = "succeeded"; // Uppdatera status till succeeded
        }
      )
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed"; // Uppdatera status till failed
        state.error = action.payload ?? "An unexpected error occurred"; // Sätt felmeddelandet
      });
  },
});

export default menuSlice.reducer; // Exportera reducer-funktionen för denna slice
