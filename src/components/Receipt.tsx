// nödvändiga imports från react, react-router, interfaces, API, styles & images.
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Order } from "../interfaces/interface";
import { fetchReceipt } from "../api/api";
import "../styles/receipt.scss";
import logo2 from "../assets/logo2.png";
import logo from "../assets/Logo.png";

// Komponenten Receipt defineras.
const Receipt = () => {
  // react-hooks useLocation, useState & useNavigate används.
  // useLocation används för
  // useState används för att lagra kvitto & eventuellt error.
  // useNavigate används för navigering
  const location = useLocation();
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // useEffect körs när location.state uppdateras.
  // async fetchReceiptData defineras.
  // api-nyckel hämtas från localStorage.
  // orderId hämtas från location.state.
  // api-nyckel & orderId loggas till konsoll.
  // om api-nyckel eller orderId inte finns så kastas error.
  // fetchReceipt med api-nyckel & orderId som parametrar importeras och körs.
  // receipt data lagras i variabel.
  // Array.isArray används för att säkerställa att receiptData.items är en array.
  // setReceipt state funktion uppdaterar state att hålla receiptData.
  // Om errror, kasta fel.

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const apiKey = localStorage.getItem("apiKey");
        const orderId = location.state?.orderId;

        console.log("apiKey:", apiKey);
        console.log("orderId:", orderId);

        if (!apiKey || !orderId) {
          setError("API key or Order ID is missing");
          return;
        }

        const data = await fetchReceipt(apiKey, orderId);
        console.log("Receipt data:", data);

        const receiptData = data?.receipt;
        console.log(receiptData?.items);

        if (receiptData && Array.isArray(receiptData.items)) {
          setReceipt(receiptData);
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
          {/* Array.isArray används för att säkerställa att receipt.items är en array */}
          {/* sedan mappas och visas varje item */}
          {Array.isArray(receipt.items) && receipt.items.length > 0 ? (
            receipt.items.map((item, index) => (
              <li key={index} className="receipt-li">
                <span>
                  {item.name} <br />{" "}
                  <span className="receipt-span-quantity">
                    {item.quantity} stycken
                  </span>
                </span>{" "}
                <span className="receipt-span-price">
                  ....... {item.price} SEK
                </span>
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
