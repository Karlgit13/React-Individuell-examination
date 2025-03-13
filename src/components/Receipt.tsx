import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Order } from "../interfaces/interface"; // Importera Order-typen
import { fetchReceipt } from "../api/api"; // Importera fetchReceipt-funktionen
import "../styles/receipt.scss";
import logo2 from "../assets/logo2.png";
import logo from "../assets/Logo.png";

const Receipt = () => {
  const location = useLocation();
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <div className="receipt-page">
      <Link to={"/"}>
        <img src={logo} alt="logo" className="receipt-logo" />
      </Link>

      <div className="receipt-container">
        <img src={logo2} alt="logo" className="receipt-logo2" />
        <p className="receipt-para1">
          <strong>KVITTO</strong>
        </p>
        <p className="receipt-para2">
          <strong>#</strong>
          {receipt.id.toLocaleUpperCase()}
        </p>

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
        <p className="receipt-para3">
          <strong>TOTALT</strong> <strong>{receipt.orderValue} SEK</strong>
        </p>
      </div>
      <button onClick={() => navigate("/")} className="receipt-order-button">
        GÖR EN NY BESTÄLLNING
      </button>
    </div>
  );
};

export default Receipt;
