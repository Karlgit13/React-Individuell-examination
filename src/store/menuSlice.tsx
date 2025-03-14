// Nödvändiga imports från Redux Toolkit och interface-filen
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem, MenuState } from "../interfaces/interface";
import { fetchApiKeyFromServer, fetchMenuFromServer } from "../api/api";

// Initialt state för menyhanteringen definieras.
// `items` är en array där menyalternativ lagras.
// `status` hanterar laddningsstatus ("idle", "loading", "succeeded", "failed").
// `error` lagrar eventuella felmeddelanden.
// `apiKey` hämtas från localStorage om det finns sparat sedan tidigare.
// `apiKeyStatus` visar status för API-nyckeln ("idle", "loading", "succeeded", "failed").
const initialState: MenuState = {
  items: [],
  status: "idle",
  error: null,
  apiKey: localStorage.getItem("apiKey") || null,
  apiKeyStatus: localStorage.getItem("apiKey") ? "succeeded" : "idle",
};

// fetchApiKey är en async Redux-thunk för att hämta en API-nyckel från servern.
// Om anropet lyckas returneras API-nyckeln som en sträng.
// Om anropet misslyckas fångas felet och returneras som ett avvisat värde.
export const fetchApiKey = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("menu/fetchApiKey", async (_, { rejectWithValue }) => {
  try {
    return await fetchApiKeyFromServer();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// fetchMenu är en async Redux-thunk för att hämta menyn från servern.
// Om en API-nyckel saknas avvisas anropet med ett felmeddelande.
// Om anropet lyckas returneras en lista med menyalternativ.
// Om anropet misslyckas fångas felet och returneras som ett avvisat värde.
export const fetchMenu = createAsyncThunk<
  { items: MenuItem[] },
  void,
  { state: { menu: MenuState }; rejectValue: string }
>("menu/fetchMenu", async (_, { getState, rejectWithValue }) => {
  // Hämtar API-nyckeln från Redux state
  const apiKey = getState().menu.apiKey;

  // Om API-nyckeln saknas avbryts anropet med ett felmeddelande.
  if (!apiKey) return rejectWithValue("API key is missing");

  try {
    return await fetchMenuFromServer(apiKey);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Redux slice för menyhanteringen skapas med createSlice.
const menuSlice = createSlice({
  // Namnet på denna slice sätts till "menu".
  name: "menu",

  // initialState sätts till den tidigare definierade initiala staten.
  initialState,

  // reducers är tom eftersom all logik hanteras i extraReducers via async thunks.
  reducers: {},

  // extraReducers används för att hantera de olika statusarna för async-thunks.
  extraReducers: (builder) => {
    builder
      // När fetchApiKey anropas sätts status till "loading".
      .addCase(fetchApiKey.pending, (state) => {
        state.apiKeyStatus = "loading";
      })

      // När fetchApiKey lyckas sparas API-nyckeln i state och status uppdateras till "succeeded".
      .addCase(
        fetchApiKey.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.apiKey = action.payload;
          state.apiKeyStatus = "succeeded";
        }
      )

      // När fetchApiKey misslyckas sätts status till "failed" och felmeddelandet lagras.
      .addCase(fetchApiKey.rejected, (state, action) => {
        state.apiKeyStatus = "failed";
        state.error = action.payload ?? "An unexpected error occurred";
      })

      // När fetchMenu anropas sätts status till "loading".
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
      })

      // När fetchMenu lyckas sparas menyalternativen i state och status uppdateras till "succeeded".
      .addCase(
        fetchMenu.fulfilled,
        (state, action: PayloadAction<{ items: MenuItem[] }>) => {
          state.items = action.payload.items;
          state.status = "succeeded";
        }
      )

      // När fetchMenu misslyckas sätts status till "failed" och felmeddelandet lagras.
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "An unexpected error occurred";
      });
  },
});

// Exporterar reducerfunktionen för att inkluderas i store.
export default menuSlice.reducer;
