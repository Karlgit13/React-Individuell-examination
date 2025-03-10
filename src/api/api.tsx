import { cartItem } from "../interfaces/interface";

const API_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

export const fetchApiKeyFromServer = async (): Promise<string> => {
  const res = await fetch(`${API_URL}/keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenant: "kalle" }),
  });

  if (!res.ok) throw new Error(`Failed to fetch API key: ${res.status}`);

  const data = await res.json();
  localStorage.setItem("apiKey", data.key);
  return data.key;
};

export const fetchMenuFromServer = async (apiKey: string) => {
  const res = await fetch(`${API_URL}/menu`, {
    headers: { "x-zocom": apiKey },
  });

  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);

  const data = await res.json();
  console.log(data);
  return data;
};

export const placeOrder = async (
  apiKey: string,
  tenant: string,
  cartItems: cartItem[]
) => {
  const res = await fetch(`${API_URL}/${tenant}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-zocom": apiKey,
    },
    body: JSON.stringify({
      items: cartItems.map((item) => item.id), // 🔹 Skicka bara ID:n
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to place order: ${res.status}`);
  }

  const data = await res.json();
  return data;
};

export const fetchReceipt = async (apiKey: string, orderId: string) => {
  const res = await fetch(`${API_URL}/receipts/${orderId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-zocom": apiKey,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch receipt: ${res.status}`);
  }

  const data = await res.json();
  return data;
};
