// importerar interfaces
import { cartItem } from "../interfaces/interface";

// API - bas-url
const API_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

// asynkron funktion för att hämta API-nyckel.
// fetch körs med POST-metoden till api-url/keys
// i body skickas tenant "kalle" med
// om response inte är ok kastas ett error med statusen
// om response är OK returneras data och sparar API-nyckel i localstorage
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

// asynkron funktion som tar apiKey som parameter och hämtar meny
// fetch körs till API-url/menu
// API-nyckeln skickas med i headern
// om response status inte är OK, kasta error
// om response status är OK returnera och lagra data
export const fetchMenuFromServer = async (apiKey: string) => {
  const res = await fetch(`${API_URL}/menu`, {
    headers: { "x-zocom": apiKey },
  });

  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);

  const data = await res.json();
  console.log(data);
  return data;
};

// asynkron funktion för att placera beställning
// asynkron funktion med 3 parametrar, apiKey, tenant & cartItems
// fetch körs med POST metoden & skickar med "tenant" till API-url/orders
// api-nyckeln skickas med i headers
// cartItems mappas över och skickas med i body
// om response ej OK, kasta error
// om response OK, returnera och lagra data
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
      items: cartItems.flatMap((item) => Array(item.quantity).fill(item.id)),
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to place order: ${res.status}`);
  }

  const data = await res.json();
  console.log("Order response:", data);
  return data;
};

// asynkron funktion för att hämta kvitto från API efter beställning lagts
// funktion tar 2 parametrar, apiKey & orderId
// fetch körs till api-url/receipts och skickar med orderId
// api-nyckel skickas med i headers
// om status ej OK, kasta error
// om status OK, returnera och lagra data
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
