// Nödvändiga importeringar från react-router, bilder, hooks & styling.
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchReceipt } from "../api/api";
import "../styles/order.scss";
import orderImage from "../assets/etaImage.png";
import logo from "../assets/Logo.png";

// Komponenten Order defineras.
const Order = () => {
  // react-hooks används.
  // useLocation används för hämta informationen om den aktuella URL:en inklusive eventuella state-data.
  // useNavigate används för navigering.
  // useEffect används för att ladda data när komponenten monteras eller som i detta fall när "order" ändras.
  // location.state?.order används för att hämta en order-variabel från den state som skickades när användaren navigerade till denna sida.
  // useState används för att lagra ETA tiden & kvitto.
  // api-nyckel hämtas från localStorage.
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const setReceipt = useState<unknown>(null)[1];
  const apiKey = localStorage.getItem("apiKey") || "";

  useEffect(() => {
    if (!order) return;

    // funktion för omvandla datum och tid till "minuter kvar"
    // interval sätts så calculateMinutesLeft körs var 10:e sekund
    const calculateMinutesLeft = () => {
      const etaTime = new Date(order.eta).getTime();
      const currentTime = Date.now();
      const diffInMinutes = Math.max(
        Math.round((etaTime - currentTime) / 60000),
        0
      );
      setMinutesLeft(diffInMinutes);
    };

    calculateMinutesLeft();
    const interval = setInterval(calculateMinutesLeft, 10000);

    return () => clearInterval(interval);
  }, [order]);

  // asynkron funktion för att hämta kvitto.
  // fetchReceipt funktion körs och skickar med API-nyckel & orderId.
  // setReceipt state uppdateras med data från fetchReceipt funktionen.
  // navigering används för att hoppa till kvitto sidan och även skicka med states orderId & receiptData.
  // om error uppstår loggas det till konsoll.
  const handleGetReceipt = async () => {
    try {
      const receiptData = await fetchReceipt(apiKey, order.id);
      setReceipt(receiptData);

      navigate("/receipt", {
        state: { orderId: order.id, receiptData: receiptData },
      });
    } catch (error) {
      console.error("Failed to fetch receipt", error);
    }
  };

  if (!order) {
    return <p>Ingen order hittades.</p>;
  }

  return (
    <div className="order-page">
      {/* Link & navigate används för navigering, toUpperCase används för göra stora bokstäver */}
      {/* När man klickar på "SE KVITTO" anropas handleGetReceipt */}
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
