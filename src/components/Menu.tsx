import "../styles/menu.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiKey, fetchMenu } from "../store/menuSlice";
import { RootState, AppDispatch } from "../store/store";
import { MenuItem } from "../interfaces/interface";
import { addItemToCart } from "../store/cartSlice";

const Menu = () => {
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

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addItemToCart(item));
    console.log(item.name, "added to cart");
  };

  return (
    <div className="menu">
      {apiKeyStatus === "failed" && <p>Failed to get API key: {error}</p>}
      {status === "failed" && <p>Failed to load menu: {error}</p>}
      <ul>
        <h1 className="menu-header">Meny</h1>
        {items.length > 0
          ? items
              .filter((item) => item.type === "wonton" || item.type === "paris")
              .map((item) => (
                <li key={item.id} onClick={() => handleAddToCart(item)}>
                  <div className="menu-item">
                    <p>{item.name.toLocaleUpperCase()}</p>{" "}
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
          {items
            .filter((item) => item.type === "drink") // Filtrerar endast dippar
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
          {items
            .filter((item) => item.type === "dip") // Filtrerar endast dippar
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
