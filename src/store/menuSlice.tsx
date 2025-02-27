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
}

// Initial state med korrekt typ
const initialState: MenuState = {
  items: [],
  status: "idle",
  error: null,
};

// Thunk för att hämta menyn
export const fetchMenu = createAsyncThunk<
  MenuItem[],
  void,
  { rejectValue: string }
>("menu/fetchMenu", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/menu`, {
      headers: { "x-zocom": "<api-key-here>" },
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
