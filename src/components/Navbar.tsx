import logo from "../assets/Logo.png"; // Importera logotypen korrekt
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"; // Importera shopping basket-ikonen
import { IconButton } from "@mui/material"; // Importera IconButton för bättre UX
import "../styles/navbar.scss";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={logo} alt="Logo" className="navbar-logo" />
      <Link to="/cart">
        <IconButton>
          <ShoppingBasketIcon fontSize="large" className="navbar-basket" />
        </IconButton>
      </Link>
    </div>
  );
};

export default Navbar;
