import "../styles/menu.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiKey, fetchMenu } from "../store/menuSlice";
import { RootState, AppDispatch } from "../store/store";
import { MenuItem } from "../interfaces/interface";
import { addItemToCart } from "../store/cartSlice";

const Menu = () => {
  const dispatch = useDispatch<AppDispatch>(); // Skapar en dispatch-funktion med rätt typ
  const { items, status, error, apiKey, apiKeyStatus } = useSelector(
    (state: RootState) => state.menu // Hämtar state från Redux store
  );

  useEffect(() => {
    if (!apiKey && apiKeyStatus === "idle") dispatch(fetchApiKey());
    // Hämtar API-nyckel om den inte finns och status är "idle"
  }, [apiKey, apiKeyStatus, dispatch]); // Körs när apiKey, apiKeyStatus eller dispatch ändras

  useEffect(() => {
    if (apiKey && apiKeyStatus === "succeeded" && status === "idle")
      dispatch(fetchMenu());
    // Hämtar menydata om API-nyckeln finns, API-nyckelstatus är "succeeded" och meny-status är "idle"
  }, [apiKey, apiKeyStatus, status, dispatch]); // Körs när apiKey, apiKeyStatus, status eller dispatch ändras

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addItemToCart(item)); // Lägger till objekt i kundvagnen
    console.log(item, "added to cart"); // Loggar objektet som lades till i kundvagnen
  };

  return (
    <div className="menu">
      {" "}
      {/* Huvudcontainer för menyn */}
      {apiKeyStatus === "failed" && <p>Failed to get API key: {error}</p>}
      {/* Visar felmeddelande om API-nyckelhämtningen misslyckades */}
      {status === "failed" && <p>Failed to load menu: {error}</p>}
      {/* Visar felmeddelande om menyhämtningen misslyckades */}
      <ul>
        {items.length > 0
          ? items.map((item) => (
              <li key={item.id}>
                {" "}
                {/* Renderar varje menyobjekt */}
                {item.name} - {item.price} kr
                <br />
                {item.ingredients}
                <button onClick={() => handleAddToCart(item)}>Lägg till</button>
                {/* Knapp för att lägga till objekt i kundvagnen */}
              </li>
            ))
          : status === "succeeded" && <p>⚠️ No menu items available.</p>}
        {/* Visar meddelande om inga menyobjekt finns tillgängliga */}
      </ul>
    </div>
  );
};

export default Menu; // Exporterar Menu-komponenten som standardexport
