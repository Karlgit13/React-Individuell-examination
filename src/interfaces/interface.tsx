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

export interface cartState {
  items: cartItem[];
}

export interface cartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: { name: string; price: number }[];
  orderValue: number;
  eta: string;
  state: string;
}
