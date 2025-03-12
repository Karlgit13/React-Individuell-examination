import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchReceipt } from "../api/api"; // Importera din nya API-funktion
import "../styles/order.scss";
import orderImage from "../assets/etaImage.png";
import logo from "../assets/Logo.png";

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
    <div className="order-page">
      <Link to={"/"}>
        <img src={logo} alt="logo" className="order-logo" />
      </Link>

      <img src={orderImage} alt="orderImage" className="order-image" />
      <h3 className="order-header3">
        DINA WONTONS <br />
        TILLAGAS!
      </h3>
      <p className="order-para1">
        <strong>ETA </strong> {minutesLeft} MIN
      </p>
      <p className="order-para2">
        <strong>#</strong>
        {order.id.toUpperCase()}
      </p>

      <div className="order-buttons">
        <button className="order-button1" onClick={() => navigate("/")}>
          GÖR EN NY BESTÄLLNING
        </button>
        <button className="order-button2" onClick={handleGetReceipt}>
          SE KVITTO
        </button>
      </div>
    </div>
  );
};

export default Order;
