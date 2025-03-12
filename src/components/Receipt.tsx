import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Order } from "../interfaces/interface"; // Importera Order-typen
import { fetchReceipt } from "../api/api"; // Importera fetchReceipt-funktionen

const Receipt = () => {
  const location = useLocation();
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const apiKey = localStorage.getItem("apiKey");
        const orderId = location.state?.orderId;

        console.log("apiKey:", apiKey); // Logga apiKey
        console.log("orderId:", orderId); // Logga orderId

        if (!apiKey || !orderId) {
          setError("API key or Order ID is missing");
          return;
        }
        
        const data = await fetchReceipt(apiKey, orderId);
        console.log("Receipt data:", data); // Logga kvittodatat

        // Hämta kvittot från receipt-objektet
        const receiptData = data?.receipt;

        if (receiptData && Array.isArray(receiptData.items)) {
          setReceipt(receiptData); // Sätt receiptData istället för hela objektet
        } else {
          setError("Inga varor i kvittot.");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch receipt");
      }
    };

    fetchReceiptData();
  }, [location.state]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!receipt) {
    return <p>Ingen kvitto hittades.</p>;
  }

  return (
    <div>
      <h2>Kvitto</h2>
      <p>
        <strong>Order-ID:</strong> {receipt.id}
      </p>
      <p>
        <strong>Ordervärde:</strong> {receipt.orderValue} SEK
      </p>

      <ul>
        {Array.isArray(receipt.items) && receipt.items.length > 0 ? (
          receipt.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.price} SEK
            </li>
          ))
        ) : (
          <p>Inga varor i kvittot.</p>
        )}
      </ul>
    </div>
  );
};

export default Receipt;
