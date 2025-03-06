import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./components/Menu";
import CartPage from "./components/Cart";
import OrderPage from "./components/Order";
import StartPage from "./components/Start";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/menuPage" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
