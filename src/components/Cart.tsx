import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import "../styles/cart.scss";
import {
  removeItemFromCart,
  decreaseItemQuantity,
  addItemToCart,
} from "../store/cartSlice";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <div className="cart">
      <div className="cart-div">
        {cartItems.length === 0 ? (
          <p>Varukorgen är tom.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} ........... {item.price * item.quantity} kr
                <button onClick={() => dispatch(decreaseItemQuantity(item.id))}>
                  -
                </button>
                <button onClick={() => dispatch(addItemToCart(item))}>+</button>
                <button onClick={() => dispatch(removeItemFromCart(item.id))}>
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="total-div"></div>
    </div>
  );
};

export default Cart;
