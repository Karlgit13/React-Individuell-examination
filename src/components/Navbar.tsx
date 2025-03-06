import logo from "../assets/Logo.png"; // Importera logotypen korrekt
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"; // Importera shopping basket-ikonen
import { IconButton } from "@mui/material"; // Importera IconButton för bättre UX

const Navbar = () => {
  return (
    <div>
      <img src={logo} alt="Logo" />
      <IconButton>
        <ShoppingBasketIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default Navbar;
