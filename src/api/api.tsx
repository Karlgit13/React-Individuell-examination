// Importerar gränssnittet "cartItem" från en separat fil som innehåller typer/interfacen
// Detta används för att ge korrekt typning på varukorgen i placeOrder-funktionen
import { cartItem } from "../interfaces/interface";

// Definierar bas-URL:en för API:et som används i alla API-anrop
const API_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

/**
 * Funktion för att hämta en API-nyckel från servern.
 * Denna nyckel lagras sedan i localStorage för att användas i framtida API-anrop.
 *
 * @returns {Promise<string>} - En Promise som returnerar API-nyckeln som en sträng.
 */
export const fetchApiKeyFromServer = async (): Promise<string> => {
  // Skickar en POST-förfrågan till API:et för att skapa en ny API-nyckel
  const res = await fetch(`${API_URL}/keys`, {
    method: "POST", // Använder POST-metoden för att skapa nyckeln
    headers: { "Content-Type": "application/json" }, // Anger att vi skickar JSON-data
    body: JSON.stringify({ tenant: "kalle" }), // Skickar en JSON-body med en "tenant"-parameter
  });

  // Om servern svarar med en felstatus kastas ett fel
  if (!res.ok) throw new Error(`Failed to fetch API key: ${res.status}`);

  // Omvandla svaret till JSON
  const data = await res.json();

  // Sparar API-nyckeln i webbläsarens localStorage för framtida användning
  localStorage.setItem("apiKey", data.key);

  // Returnerar API-nyckeln
  return data.key;
};

/**
 * Funktion för att hämta menyn från servern.
 *
 * @param {string} apiKey - API-nyckeln för autentisering.
 * @returns {Promise<any>} - En Promise som returnerar menyn i JSON-format.
 */
export const fetchMenuFromServer = async (apiKey: string) => {
  // Skickar en GET-förfrågan till API:et med API-nyckeln som header
  const res = await fetch(`${API_URL}/menu`, {
    headers: { "x-zocom": apiKey }, // API-nyckeln används för autentisering
  });

  // Hantera fel om förfrågan misslyckas
  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);

  // Omvandla svaret till JSON-format
  const data = await res.json();

  // Logga datan i konsolen för debugging
  console.log(data);

  return data;
};

/**
 * Funktion för att lägga en beställning via API:et.
 *
 * @param {string} apiKey - API-nyckeln för autentisering.
 * @param {string} tenant - Namnet på den tenant som beställningen görs under.
 * @param {cartItem[]} cartItems - En array av varor som användaren vill beställa.
 * @returns {Promise<any>} - En Promise som returnerar beställningens responsdata.
 */
export const placeOrder = async (
  apiKey: string,
  tenant: string,
  cartItems: cartItem[]
) => {
  // Skickar en POST-förfrågan till API:et för att skapa en beställning
  const res = await fetch(`${API_URL}/${tenant}/orders`, {
    method: "POST", // Använder POST-metoden för att skicka en ny beställning
    headers: {
      "Content-Type": "application/json",
      "x-zocom": apiKey, // Skickar API-nyckeln i headers för autentisering
    },
    body: JSON.stringify({
      items: cartItems.map((item) => item.id), // 🔹 Skickar endast varornas ID:n, inte hela objekten
    }),
  });

  // Om förfrågan misslyckas kastas ett fel
  if (!res.ok) {
    throw new Error(`Failed to place order: ${res.status}`);
  }

  // Omvandla svaret till JSON-format
  const data = await res.json();
  return data;
};

/**
 * Funktion för att hämta kvitto för en genomförd beställning.
 *
 * @param {string} apiKey - API-nyckeln för autentisering.
 * @param {string} orderId - ID för den beställning man vill hämta kvitto för.
 * @returns {Promise<any>} - En Promise som returnerar kvittodata i JSON-format.
 */
export const fetchReceipt = async (apiKey: string, orderId: string) => {
  // Skickar en GET-förfrågan till API:et för att hämta kvittot
  const res = await fetch(`${API_URL}/receipts/${orderId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-zocom": apiKey, // API-nyckeln används för autentisering
    },
  });

  // Hantera fel om förfrågan misslyckas
  if (!res.ok) {
    throw new Error(`Failed to fetch receipt: ${res.status}`);
  }

  // Omvandla svaret till JSON-format
  const data = await res.json();
  return data;
};
