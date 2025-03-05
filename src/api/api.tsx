const API_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

// Funktion för att hämta API-nyckeln
export const fetchApiKeyFromServer = async (): Promise<string> => {
  const res = await fetch(`${API_URL}/keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenant: "kalle" }),
  });

  if (!res.ok) throw new Error(`Failed to fetch API key: ${res.status}`);

  const data = await res.json();
  localStorage.setItem("apiKey", data.key); // Spara nyckeln
  return data.key;
};

// Funktion för att hämta menyn
export const fetchMenuFromServer = async (apiKey: string) => {
  const res = await fetch(`${API_URL}/menu`, {
    headers: { "x-zocom": apiKey },
  });

  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);

  return res.json(); // Returnerar { items: MenuItem[] }
};
