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

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const apiKey = localStorage.getItem("apiKey") || "";
  const navigate = useNavigate();
  const tenant = "x-zocom";

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

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
      <Navbar />
      <div className="cart-div">
        {cartItems.length === 0 ? (
          <p>Varukorgen är tom.</p>
        ) : (
          <ul>
            <hr />
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
          <p>TOTALT</p> <p>{getTotalPrice()} SEK</p>
        </h3>
        <button className="total-div-button" onClick={handlePlaceOrder}>
          TAKE MY MONEY!
        </button>
      </div>
    </div>
  );
};

export default Cart;
