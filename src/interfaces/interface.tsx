export interface MenuItem {
  id: string;
  name: string;
  price: number;
  ingredients: string;
}

export interface MenuState {
  items: MenuItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  apiKey: string | null;
  apiKeyStatus: "idle" | "loading" | "succeeded" | "failed";
}
