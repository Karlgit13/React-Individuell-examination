import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface MenuState {
  items: MenuItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  apiKey: string | null;
  apiKeyStatus: "idle" | "loading" | "succeeded" | "failed";
}

// Initial state med korrekt typ
const initialState: MenuState = {
  items: [],
  status: "idle",
  error: null,
  apiKey: null,
  apiKeyStatus: "idle",
};

// Thunk för att hämta API-nyckeln
export const fetchApiKey = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("menu/fetchApiKey", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant: "kalle" }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch API key: ${res.status}`);
    }

    const data = await res.json();
    console.log("API Key received:", data.key); // ✅ Kontrollera att rätt värde returneras

    return data.key; // 🔥 Uppdaterad från data.apiKey till data.key
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Thunk för att hämta menyn
export const fetchMenu = createAsyncThunk<
  MenuItem[],
  void,
  { state: { menu: MenuState }; rejectValue: string }
>("menu/fetchMenu", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const apiKey = state.menu.apiKey;

  if (!apiKey) {
    return rejectWithValue("API key is missing");
  }

  try {
    const res = await fetch(`${API_URL}/menu`, {
      headers: { "x-zocom": apiKey },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch menu: ${res.status}`);
    }

    return (await res.json()) as MenuItem[];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiKey.pending, (state) => {
        state.apiKeyStatus = "loading";
      })
      .addCase(
        fetchApiKey.fulfilled,
        (state, action: PayloadAction<string>) => {
          console.log("API Key received:", action.payload); // Logga API-nyckeln
          state.apiKeyStatus = "succeeded";
          state.apiKey = action.payload;
        }
      )
      .addCase(fetchApiKey.rejected, (state, action) => {
        state.apiKeyStatus = "failed";
        state.error = action.payload ?? "An unexpected error occurred";
      })
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchMenu.fulfilled,
        (state, action: PayloadAction<MenuItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "An unexpected error occurred";
      });
  },
});

export default menuSlice.reducer;
