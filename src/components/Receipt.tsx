// Importerar React-hookarna useEffect och useState för att hantera state och sidladdning
import { useEffect, useState } from "react";
// Importerar Link för navigation, useLocation för att hämta data från föregående sida, och useNavigate för att navigera
import { Link, useLocation, useNavigate } from "react-router-dom";
// Importerar Order-typen för att säkerställa att vi använder rätt datatyp för kvittot
import { Order } from "../interfaces/interface";
// Importerar API-funktionen som hämtar kvittot
import { fetchReceipt } from "../api/api";
// Importerar stilmallen för kvittosidan
import "../styles/receipt.scss";
// Importerar logotyper
import logo2 from "../assets/logo2.png";
import logo from "../assets/Logo.png";

// Huvudkomponenten för kvittosidan
const Receipt = () => {
  // Hämtar information från URL:ens state (t.ex. orderId)
  const location = useLocation();
  // Skapar ett state för att lagra kvittodata
  const [receipt, setReceipt] = useState<Order | null>(null);
  // Skapar ett state för att hantera eventuella felmeddelanden
  const [error, setError] = useState<string | null>(null);
  // useNavigate hook för att möjliggöra navigation tillbaka till startsidan
  const navigate = useNavigate();

  // useEffect körs när komponenten renderas första gången och när location.state ändras
  useEffect(() => {
    // Asynkron funktion för att hämta kvittodata från API:et
    const fetchReceiptData = async () => {
      try {
        // Hämtar API-nyckeln från localStorage
        const apiKey = localStorage.getItem("apiKey");
        // Hämtar order-ID från den skickade state-informationen
        const orderId = location.state?.orderId;

        // Loggar API-nyckel och order-ID för felsökning
        console.log("apiKey:", apiKey);
        console.log("orderId:", orderId);

        // Om API-nyckeln eller order-ID saknas, sätt ett felmeddelande och avsluta
        if (!apiKey || !orderId) {
          setError("API key or Order ID is missing");
          return;
        }

        // Anropar API-funktionen för att hämta kvittot
        const data = await fetchReceipt(apiKey, orderId);
        console.log("Receipt data:", data); // Loggar kvittodatat för felsökning

        // Hämtar kvittodata från API-svaret
        const receiptData = data?.receipt;

        // Om kvittodatat finns och innehåller en array av varor, spara det i state
        if (receiptData && Array.isArray(receiptData.items)) {
          setReceipt(receiptData);
        } else {
          setError("Inga varor i kvittot.");
        }
      } catch (error) {
        console.error(error); // Loggar felet i konsolen
        setError("Failed to fetch receipt"); // Sätter ett felmeddelande i state
      }
    };

    // Anropar funktionen för att hämta kvittot
    fetchReceiptData();
  }, [location.state]); // useEffect körs om location.state ändras

  // Om det uppstått ett fel, visa felmeddelandet
  if (error) {
    return <p>{error}</p>;
  }

  // Om kvittot inte har laddats ännu, visa ett meddelande
  if (!receipt) {
    return <p>Ingen kvitto hittades.</p>;
  }

  // Returnerar JSX-strukturen för kvittosidan
  return (
    <div className="receipt-page">
      {/* Klickbar logotyp som navigerar tillbaka till startsidan */}
      <Link to={"/"}>
        <img src={logo} alt="logo" className="receipt-logo" />
      </Link>

      <div className="receipt-container">
        {/* Extra logotyp och rubrik för kvittot */}
        <img src={logo2} alt="logo" className="receipt-logo2" />
        <p className="receipt-para1">
          <strong>KVITTO</strong>
        </p>
        <p className="receipt-para2">
          <strong>#</strong>
          {receipt.id.toLocaleUpperCase()} {/* Visar order-ID i versaler */}
        </p>

        {/* Lista över beställda varor */}
        <ul className="receipt-ul">
          {Array.isArray(receipt.items) && receipt.items.length > 0 ? (
            receipt.items.map((item, index) => (
              <li key={index} className="receipt-li">
                <span>{item.name}</span> <span>....... {item.price} SEK</span>
              </li>
            ))
          ) : (
            <p>Inga varor i kvittot.</p>
          )}
        </ul>

        {/* Totalpris för beställningen */}
        <p className="receipt-para3">
          <strong>TOTALT</strong> <strong>{receipt.orderValue} SEK</strong>
        </p>
      </div>

      {/* Knapp för att gå tillbaka till startsidan och göra en ny beställning */}
      <button onClick={() => navigate("/")} className="receipt-order-button">
        GÖR EN NY BESTÄLLNING
      </button>
    </div>
  );
};

// Exporterar Receipt-komponenten så att den kan användas i appen
export default Receipt;
