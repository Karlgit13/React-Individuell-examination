import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import "../styles/cart.scss";
import {
  removeItemFromCart,
  decreaseItemQuantity,
  addItemToCart,
} from "../store/cartSlice";

// Definierar Cart-komponenten
const Cart = () => {
  // Använder useDispatch hook för att få tillgång till dispatch-funktionen
  const dispatch = useDispatch<AppDispatch>();
  // Använder useSelector hook för att hämta varukorgens objekt från state
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Funktion för att beräkna det totala priset av alla objekt i varukorgen
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Returnerar JSX som beskriver hur varukorgen ska renderas
  return (
    <div className="cart">
      <div className="cart-div">
        {cartItems.length === 0 ? (
          // Om varukorgen är tom, visa ett meddelande
          <p>Varukorgen är tom.</p>
        ) : (
          // Annars, lista alla objekt i varukorgen
          <ul>
            {cartItems.map((item) => (
              // Varje objekt renderas som en listpunkt
              <li key={item.id}>
                {item.name} ........... {item.price * item.quantity} kr
                {/* Knapp för att minska kvantiteten av ett objekt */}
                <button onClick={() => dispatch(decreaseItemQuantity(item.id))}>
                  -
                </button>
                {/* Knapp för att öka kvantiteten av ett objekt */}
                <button onClick={() => dispatch(addItemToCart(item))}>+</button>
                {/* Knapp för att ta bort ett objekt från varukorgen */}
                <button onClick={() => dispatch(removeItemFromCart(item.id))}>
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="total-div">
        {/* Visar det totala priset av alla objekt i varukorgen */}
        <h3>TOTALT {getTotalPrice()} SEK</h3>
        {/* Knapp för att genomföra köpet */}
        <button>TAKE MY MONEY!</button>
      </div>
    </div>
  );
};

// Exporterar Cart-komponenten som standardexport
export default Cart;
