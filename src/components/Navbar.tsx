import logo from "../assets/Logo.png";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { IconButton } from "@mui/material";
import "../styles/navbar.scss";
import { Link } from "react-router-dom";

// Definiera Navbar komponenten
const Navbar = () => {
  return (
    // Huvudbehållaren för navbaren med en CSS-klass för styling
    <div className="navbar">
      {/* Visa logotypen med en CSS-klass för styling */}
      <img src={logo} alt="Logo" className="navbar-logo" />

      {/* Skapa en länk till kundvagnen */}
      <Link to="/cart">
        {/* Använd en IconButton för att omsluta shopping basket-ikonen */}
        <IconButton>
          {/* Visa shopping basket-ikonen med en CSS-klass för styling */}
          <ShoppingBasketIcon fontSize="large" className="navbar-basket" />
        </IconButton>
      </Link>
    </div>
  );
};

// Exportera Navbar komponenten som standardexport
export default Navbar;
