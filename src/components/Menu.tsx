// nödvändiga importeringar från redux, menuSlice, cartSlice, store, interfaces & styling.
import "../styles/menu.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiKey, fetchMenu } from "../store/menuSlice";
import { RootState, AppDispatch } from "../store/store";
import { MenuItem } from "../interfaces/interface";
import { addItemToCart } from "../store/cartSlice";

// komponenten Menu defineras.
const Menu = () => {
  // react-hooks så som useDispatch, useSelector & useEffect används.
  // useDispatch används för att skicka "actions" till redux store vilket möjliggör uppdatering av state.
  // useSelector används för att hämta data(state) från redux store.
  // useEffect används för att ladda data när komponenten monteras eller som t.e.x när apiKey eller status ändras.
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, apiKey, apiKeyStatus } = useSelector(
    (state: RootState) => state.menu
  );

  useEffect(() => {
    if (!apiKey && apiKeyStatus === "idle") dispatch(fetchApiKey());
  }, [apiKey, apiKeyStatus, dispatch]);

  useEffect(() => {
    if (apiKey && apiKeyStatus === "succeeded" && status === "idle")
      dispatch(fetchMenu());
  }, [apiKey, apiKeyStatus, status, dispatch]);

  // funktion tar emot "item" som parameter och används för lägga varor i cart.
  // dispatch används för att skicka funktionen "addItemToCart" som en action till redux store och där uppdatera state.
  // item loggas till konsoll.
  const handleAddToCart = (item: MenuItem) => {
    dispatch(addItemToCart(item));
    console.log(item.name, "added to cart");
  };

  return (
    <div className="menu">
      {/* om status är failed, visa error meddelande */}
      {apiKeyStatus === "failed" && <p>Failed to get API key: {error}</p>}
      {status === "failed" && <p>Failed to load menu: {error}</p>}
      <ul>
        <h1 className="menu-header">Meny</h1>
        {/* om items ej är tomt filtrera ut endast "wontons" och sedan mappa över varje objekt */}
        {/* toLocaleUpperCase används för att göra bokstäverna stora */}
        {/* Array.isArray används för att säkerställa att data är en array */}
        {items.length > 0
          ? items
              .filter((item) => item.type === "wonton" || item.type === "paris")
              .map((item) => (
                <li key={item.id} onClick={() => handleAddToCart(item)}>
                  <div className="menu-item">
                    <p>{item.name.toLocaleUpperCase()}</p>
                    <p>........ {item.price} SEK</p>
                  </div>
                  <span className="menu-ingredients">
                    {Array.isArray(item.ingredients)
                      ? item.ingredients.join(", ")
                      : item.ingredients}
                    <hr />
                  </span>
                </li>
              ))
          : status === "succeeded" && <p>No menu items available.</p>}
        <h2>Dryck ...... 19 SEK</h2>
        <div className="menu-drink">
          {/* Samma här först filrera sen mappa och visa data */}
          {items
            .filter((item) => item.type === "drink")
            .map((drink) => (
              <p
                key={drink.id}
                className="menu-sauce-dip"
                onClick={() => handleAddToCart(drink)}
              >
                {drink.name}
              </p>
            ))}
        </div>
        <hr />
        <h2>Dipsås ...... 19 SEK</h2>
        <div className="menu-sauce">
          {/* Samma här först filrera sen mappa och visa data */}
          {items
            .filter((item) => item.type === "dip")
            .map((dip) => (
              <p
                key={dip.id}
                className="menu-sauce-dip"
                onClick={() => handleAddToCart(dip)}
              >
                {dip.name}
              </p>
            ))}
        </div>
      </ul>
    </div>
  );
};

export default Menu;
