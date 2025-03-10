import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchReceipt } from "../api/api"; // Importera din nya API-funktion

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order; // Hämtar orderData från state
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const setReceipt = useState<unknown>(null)[1]; // Function to set receipt
  const apiKey = localStorage.getItem("apiKey") || "";

  useEffect(() => {
    if (!order) return;

    const calculateMinutesLeft = () => {
      const etaTime = new Date(order.eta).getTime();
      const currentTime = Date.now();
      const diffInMinutes = Math.max(
        Math.round((etaTime - currentTime) / 60000),
        0
      );
      setMinutesLeft(diffInMinutes);
    };

    calculateMinutesLeft(); // Beräkna direkt vid render
    const interval = setInterval(calculateMinutesLeft, 10000); // Uppdatera varje 10 sekunder

    return () => clearInterval(interval); // Rensa intervallet vid unmount
  }, [order]);

  const handleGetReceipt = async () => {
    try {
      const receiptData = await fetchReceipt(apiKey, order.id); // Hämta kvittot med hjälp av API:et
      setReceipt(receiptData); // Sätt kvittot i state
      navigate("/receipt", {
        state: { orderId: order.id, receiptData: receiptData },
      }); // Navigera till kvitto-sidan och skicka orderId
    } catch (error) {
      console.error("Failed to fetch receipt", error);
    }
  };

  if (!order) {
    return <p>Ingen order hittades.</p>;
  }

  return (
    <div>
      <h2>Orderbekräftelse</h2>
      <p>
        <strong>Order-ID:</strong> {order.id}
      </p>
      <p>
        <strong>Leverans om:</strong> {minutesLeft} min
      </p>
      <div>
        <button onClick={() => navigate("/")}>Gör en ny beställning</button>
        <button onClick={handleGetReceipt}>SE KVITTO</button>
      </div>
    </div>
  );
};

export default Order;
