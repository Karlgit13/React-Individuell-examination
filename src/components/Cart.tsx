import { useDispatch, useSelector } from "react-redux"; // Importerar hooks från React Redux för att hämta och uppdatera state i Redux
import { AppDispatch, RootState } from "../store/store"; // Importerar typer för AppDispatch och RootState för type-säkerhet
import "../styles/cart.scss"; // Importerar SCSS-styling för kundvagnen
import {
  removeItemFromCart,
  decreaseItemQuantity,
  addItemToCart,
} from "../store/cartSlice"; // Importerar actions för att hantera objekt i kundvagnen
import { useNavigate } from "react-router-dom"; // Importerar useNavigate för att navigera mellan sidor i appen
import { placeOrder } from "../api/api"; // Importerar API-anrop för att lägga en order
import Navbar from "./Navbar"; // Importerar Navbar-komponenten för att visa en navigeringsmeny

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>(); // Skapar en dispatch-funktion för att skicka actions till Redux-store
  const cartItems = useSelector((state: RootState) => state.cart.items); // Hämtar kundvagnens objekt från Redux-state
  const apiKey = localStorage.getItem("apiKey") || ""; // Hämtar API-nyckeln från localStorage
  const navigate = useNavigate(); // Använder useNavigate för att navigera till andra sidor
  const tenant = "x-zocom"; // Tenant-identifierare för API-anropet

  // Räknar ihop totala summan av varukorgen genom att summera varje objekt (pris * kvantitet)
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Hanterar API-anropet för att lägga en order och navigerar till order-sidan när det lyckas
  const handlePlaceOrder = async () => {
    try {
      // Anropar API-funktionen för att placera en order
      const orderData = await placeOrder(apiKey, tenant, cartItems);
      console.log("orderdata", orderData);
      // Navigerar till order-sidan och skickar med orderdata
      navigate("/order", { state: { order: orderData.order } });
    } catch (error) {
      // Om något går fel loggas felet till konsolen
      console.error(error);
    }
  };

  return (
    <div className="cart">
      {" "}
      {/* Container för kundvagnen */}
      <Navbar /> {/* Renderar Navbar-komponenten */}
      <div className="cart-div">
        {cartItems.length === 0 ? ( // Om kundvagnen är tom, visa ett meddelande
          <p>Varukorgen är tom.</p>
        ) : (
          <ul>
            <hr />
            {cartItems.map(
              (
                item // Renderar varje objekt i kundvagnen
              ) => (
                <li key={item.id} className="cart-li">
                  {item.name} {/* Visar namn på objektet */}
                  <div>
                    ........... {item.price * item.quantity} SEK{"  "}{" "}
                    {/* Visar totalpris för objektet (pris * kvantitet) */}
                    <button
                      onClick={() => dispatch(decreaseItemQuantity(item.id))} // Minskar kvantiteten på objektet
                    >
                      -
                    </button>
                    <button onClick={() => dispatch(addItemToCart(item))}>
                      {" "}
                      {/* Ökar kvantiteten på objektet */}+
                    </button>
                    <button
                      onClick={() => dispatch(removeItemFromCart(item.id))}
                    >
                      {" "}
                      {/* Tar bort objektet från kundvagnen */}X
                    </button>
                  </div>
                </li>
              )
            )}
            <hr />
          </ul>
        )}
      </div>
      <div className="total-div">
        {" "}
        {/* Container för totalpriset och orderknappen */}
        <h3 className="total-div-header">
          <p>TOTALT</p> <p>{getTotalPrice()} SEK</p>{" "}
          {/* Visar totala summan av varukorgen */}
        </h3>
        <button className="total-div-button" onClick={handlePlaceOrder}>
          {" "}
          {/* Knapp för att lägga en order */}
          TAKE MY MONEY!
        </button>
      </div>
    </div>
  );
};

export default Cart; // Exporterar Cart-komponenten så den kan användas i andra delar av appen
