// Importerar nödvändiga resurser och bibliotek
import logo from "../assets/Logo.png"; // Importerar logotypen för navbaren
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"; // Importerar shoppingbasketikonen från Material UI
import { IconButton } from "@mui/material"; // Importerar IconButton från Material UI för att göra ikonen klickbar
import "../styles/navbar.scss"; // Importerar SCSS-stilen för navbaren
import { Link } from "react-router-dom"; // Importerar Link från react-router-dom för att kunna navigera mellan olika sidor
import { useSelector } from "react-redux"; // Importerar useSelector-hooken från react-redux för att hämta data från Redux-statet
import { RootState } from "../store/store"; // Importerar RootState-typen för att säkerställa att staten har korrekt typ

const Navbar = () => {
  // Använder useSelector för att hämta varor i kundvagnen från Redux-statet
  // 'cartItems' kommer innehålla alla objekt i kundvagnen
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Beräknar den totala mängden varor i kundvagnen genom att summera varje varas quantity
  // 'reduce' går igenom 'cartItems' och lägger till varje items quantity till summan
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="navbar">
      {" "}
      {/* Container för navbaren */}
      <Link to="/">
        {" "}
        {/* Link som navigerar användaren till hemsidan (root route) */}
        <img src={logo} alt="Logo" className="navbar-logo" />{" "}
        {/* Visar logotypen */}
      </Link>
      <Link to="/cart" className="cart-icon">
        {" "}
        {/* Link som navigerar användaren till kundvagnssidan */}
        <IconButton>
          {" "}
          {/* IconButton gör ikonen klickbar */}
          <ShoppingBasketIcon
            style={{ fontSize: 50 }} // Inline-styling för att sätta ikonen till en storlek på 50px
            className="navbar-basket" // Tilldelar CSS-klass för att styla basketikonen
          />
          {totalQuantity > 0 && ( // Villkorlig rendering av badge om totalQuantity är större än 0
            <span className="cart-badge">{totalQuantity}</span> // Visar den totala mängden i en badge
          )}
        </IconButton>
      </Link>
    </div>
  );
};

export default Navbar; // Exporterar Navbar-komponenten så den kan användas i andra delar av appen
