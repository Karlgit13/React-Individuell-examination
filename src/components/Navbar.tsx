import logo from "../assets/Logo.png";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { IconButton } from "@mui/material";
import "../styles/navbar.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Navbar = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="navbar">
      <Link to="/">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </Link>

      <Link to="/cart" className="cart-icon">
        <IconButton>
          <ShoppingBasketIcon
            style={{ fontSize: 50 }}
            className="navbar-basket"
          />
          {totalQuantity > 0 && (
            <span className="cart-badge">{totalQuantity}</span>
          )}
        </IconButton>
      </Link>
    </div>
  );
};

export default Navbar;
