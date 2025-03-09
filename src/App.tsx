import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Start from "./components/Start";
import "./App.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/menuPage" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </Router>
  );
}

export default App;
