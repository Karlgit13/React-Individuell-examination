import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./components/MenuPage";
import CartPage from "./components/CartPage";
import OrderPage from "./components/OrderPage";
import StartPage from "./components/StartPage";

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
