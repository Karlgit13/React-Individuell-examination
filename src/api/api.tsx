const API_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

// Funktion för att hämta API-nyckeln
export const fetchApiKeyFromServer = async (): Promise<string> => {
  // Skickar en POST-förfrågan till /keys endpointen för att hämta API-nyckeln
  const res = await fetch(`${API_URL}/keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // Anger att vi skickar JSON-data
    body: JSON.stringify({ tenant: "kalle" }), // Skickar med tenant-information i förfrågan
  });

  // Om förfrågan misslyckas, kasta ett fel med statuskoden
  if (!res.ok) throw new Error(`Failed to fetch API key: ${res.status}`);

  // Om förfrågan lyckas, hämta JSON-svaret
  const data = await res.json();
  // Spara API-nyckeln i localStorage
  localStorage.setItem("apiKey", data.key);
  // Returnera API-nyckeln
  return data.key;
};

// Funktion för att hämta menyn
export const fetchMenuFromServer = async (apiKey: string) => {
  // Skickar en GET-förfrågan till /menu endpointen med API-nyckeln i headers
  const res = await fetch(`${API_URL}/menu`, {
    headers: { "x-zocom": apiKey }, // Inkluderar API-nyckeln i headers
  });

  // Om förfrågan misslyckas, kasta ett fel med statuskoden
  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);

  // Om förfrågan lyckas, returnera JSON-svaret som innehåller menyn
  const data = await res.json()
  console.log(data)
  return data
};
