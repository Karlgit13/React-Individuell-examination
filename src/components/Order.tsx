// Importerar nödvändiga moduler och hookar
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Importerar API-funktionen för att hämta kvittot
import { fetchReceipt } from "../api/api";
// Importerar stilfilen för ordersidan
import "../styles/order.scss";
// Importerar bilder
import orderImage from "../assets/etaImage.png";
import logo from "../assets/Logo.png";

// 🎯 Huvudkomponenten för ordersidan
const Order = () => {
  // Hämtar orderdata som skickades via state från föregående sida
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order; // Hämtar orderData från state

  // State för att lagra återstående tid tills ordern är klar
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  // Dummy-funktion för att uppdatera kvittot, även om det inte används här
  const setReceipt = useState<unknown>(null)[1];
  // Hämtar API-nyckeln från localStorage, om det inte finns någon sätts den till en tom sträng
  const apiKey = localStorage.getItem("apiKey") || "";

  // 🎯 useEffect för att räkna ner tiden tills ordern är färdig
  useEffect(() => {
    // Om ingen order finns, avbryt
    if (!order) return;

    // Funktion för att beräkna återstående tid
    const calculateMinutesLeft = () => {
      const etaTime = new Date(order.eta).getTime(); // Konverterar orderns ETA till millisekunder
      const currentTime = Date.now(); // Hämtar nuvarande tid i millisekunder
      const diffInMinutes = Math.max(
        Math.round((etaTime - currentTime) / 60000), // Beräknar skillnaden i minuter
        0 // Säkerställer att tiden aldrig blir negativ
      );
      setMinutesLeft(diffInMinutes); // Uppdaterar state med återstående tid
    };

    calculateMinutesLeft(); // Kör funktionen direkt vid render
    const interval = setInterval(calculateMinutesLeft, 10000); // Uppdatera var 10:e sekund

    return () => clearInterval(interval); // Rensar intervallet vid unmount
  }, [order]); // useEffect körs om order ändras

  // 🎯 Funktion för att hämta kvittot och navigera till kvittosidan
  const handleGetReceipt = async () => {
    try {
      // Anropar API:et för att hämta kvittot med order-ID och API-nyckeln
      const receiptData = await fetchReceipt(apiKey, order.id);
      setReceipt(receiptData); // Uppdaterar state med kvittot (ej använt i denna komponent)

      // Navigerar till kvittosidan och skickar med order-ID och kvittodata via state
      navigate("/receipt", {
        state: { orderId: order.id, receiptData: receiptData },
      });
    } catch (error) {
      console.error("Failed to fetch receipt", error); // Loggar eventuella fel
    }
  };

  // Om ingen order hittades, visa ett felmeddelande
  if (!order) {
    return <p>Ingen order hittades.</p>;
  }

  // 🎯 Returnerar JSX-strukturen för ordersidan
  return (
    <div className="order-page">
      {/* Klickbar logotyp som navigerar tillbaka till startsidan */}
      <Link to={"/"}>
        <img src={logo} alt="logo" className="order-logo" />
      </Link>

      {/* Bild på en ETA-indikator */}
      <img src={orderImage} alt="orderImage" className="order-image" />

      {/* Huvudrubrik som visar att beställningen tillagas */}
      <h3 className="order-header3">
        DINA WONTONS <br />
        TILLAGAS!
      </h3>

      {/* Visar ETA i minuter */}
      <p className="order-para1">
        <strong>ETA </strong> {minutesLeft} MIN
      </p>

      {/* Visar order-ID */}
      <p className="order-para2">
        <strong>#</strong>
        {order.id.toUpperCase()} {/* Konverterar till versaler */}
      </p>

      {/* Två knappar: en för att göra en ny beställning och en för att se kvittot */}
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

// 🎯 Exporterar Order-komponenten så att den kan användas i appen
export default Order;
