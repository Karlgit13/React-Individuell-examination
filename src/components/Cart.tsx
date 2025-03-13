// nödvändiga importeringar från redux, store, cartSlice, react-router, API & styling.
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import "../styles/cart.scss";
import {
  removeItemFromCart,
  decreaseItemQuantity,
  addItemToCart,
} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/api";
import Navbar from "./Navbar";

// komponenten Cart defineras.
const Cart = () => {
  // react-hooks så som useDispatch, useSelector & useNavigate används.
  // useDispatch används för att skicka "actions" till redux store.
  // useSelector används för att hämta data(state) från redux store.
  // useNavigate används för navigering.
  // API-nyckel hämtas från localstorage.
  // x-zocom lagras i tenant-variabeln.
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const apiKey = localStorage.getItem("apiKey") || "";
  const tenant = "x-zocom";

  // funktion för räkna ihop totala priset på varor.
  // reduce metoden används för att räkna priset gånger antalet.
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // asynkron funktion för hantera beställning.
  // placeOrder importeras och körs inuti funktion och lagrar data.
  // navigate skickar en till order sidan och även skickar med orderData som state.
  // om error, logga till konsoll.
  const handlePlaceOrder = async () => {
    try {
      const orderData = await placeOrder(apiKey, tenant, cartItems);
      console.log("orderdata", orderData);
      navigate("/order", { state: { order: orderData.order } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cart">
      {/* navbar renderas */}
      <Navbar />
      <div className="cart-div">
        {/* om cartItems är tom visa meddelande */}
        {cartItems.length === 0 ? (
          <p>Varukorgen är tom.</p>
        ) : (
          <ul>
            <hr />
            {/* mappar över cartItems för att visa varje meny-objekt */}
            {/* dispatch skickar funktioner som actions till redux store för att uppdatera state */}
            {cartItems.map((item) => (
              <li key={item.id} className="cart-li">
                {item.name}
                <div>
                  ........... {item.price * item.quantity} SEK{"  "}
                  <button
                    onClick={() => dispatch(decreaseItemQuantity(item.id))}
                  >
                    -
                  </button>
                  <button onClick={() => dispatch(addItemToCart(item))}>
                    +
                  </button>
                  <button onClick={() => dispatch(removeItemFromCart(item.id))}>
                    X
                  </button>
                </div>
              </li>
            ))}
            <hr />
          </ul>
        )}
      </div>
      <div className="total-div">
        <h3 className="total-div-header">
          {/* getTotalPrice anropas och visar priset */}
          <p>TOTALT</p> <p>{getTotalPrice()} SEK</p>
        </h3>
        {/* handlePlaceOrder anropas när man klickar på knappen */}
        <button className="total-div-button" onClick={handlePlaceOrder}>
          TAKE MY MONEY!
        </button>
      </div>
    </div>
  );
};

export default Cart;
