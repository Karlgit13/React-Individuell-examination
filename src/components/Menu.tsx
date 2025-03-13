// Importerar nödvändiga resurser och bibliotek
import "../styles/menu.scss"; // Importerar SCSS-styling för menyn
import { useEffect } from "react"; // Importerar useEffect-hooken för att hantera sid-effekter
import { useDispatch, useSelector } from "react-redux"; // Importerar hooks från react-redux för att hämta och uppdatera state i Redux
import { fetchApiKey, fetchMenu } from "../store/menuSlice"; // Importerar actions för att hämta API-nyckel och menydata från Redux
import { RootState, AppDispatch } from "../store/store"; // Importerar typer för RootState och AppDispatch för type-säkerhet
import { MenuItem } from "../interfaces/interface"; // Importerar MenuItem-gränssnittet för att typa menyobjekten
import { addItemToCart } from "../store/cartSlice"; // Importerar action för att lägga till objekt i kundvagnen

const Menu = () => {
  // Skapar en dispatch-funktion för att skicka actions till Redux-store
  const dispatch = useDispatch<AppDispatch>();

  // Hämtar states från Redux-statet: items (menyobjekt), status, error, apiKey och apiKeyStatus
  const { items, status, error, apiKey, apiKeyStatus } = useSelector(
    (state: RootState) => state.menu
  );

  // useEffect för att hämta API-nyckel när komponenten laddas första gången
  // Den kontrollerar om apiKey är tom och om apiKeyStatus är "idle", i så fall skickas actionen fetchApiKey
  useEffect(() => {
    if (!apiKey && apiKeyStatus === "idle") dispatch(fetchApiKey());
  }, [apiKey, apiKeyStatus, dispatch]);

  // useEffect för att hämta menyn från API när API-nyckeln har hämtats och statusen är "idle"
  useEffect(() => {
    if (apiKey && apiKeyStatus === "succeeded" && status === "idle")
      dispatch(fetchMenu());
  }, [apiKey, apiKeyStatus, status, dispatch]);

  // Funktion som hanterar att lägga till ett objekt i kundvagnen
  // Tar emot ett item som parameter och skickar actionen addItemToCart till Redux
  const handleAddToCart = (item: MenuItem) => {
    dispatch(addItemToCart(item)); // Lägger till item i kundvagnen
    console.log(item.name, "added to cart"); // Loggar till konsolen när ett objekt läggs till
  };

  return (
    <div className="menu">
      {" "}
      {/* Container för menyn */}
      {/* Visar felmeddelande om API-nyckeln inte kan hämtas */}
      {apiKeyStatus === "failed" && <p>Failed to get API key: {error}</p>}
      {/* Visar felmeddelande om menyn inte kan hämtas */}
      {status === "failed" && <p>Failed to load menu: {error}</p>}
      <ul>
        <h1 className="menu-header">Meny</h1>
        {/* Här filtreras menyn så att bara objekt av typ 'wonton' eller 'paris' visas */}
        {items.length > 0
          ? items
              .filter((item) => item.type === "wonton" || item.type === "paris")
              .map((item) => (
                <li key={item.id} onClick={() => handleAddToCart(item)}>
                  <div className="menu-item">
                    <p>{item.name.toLocaleUpperCase()}</p>{" "}
                    <p>........ {item.price} SEK</p>
                  </div>
                  {/* Visar ingredienser om de finns */}
                  <span className="menu-ingredients">
                    {Array.isArray(item.ingredients)
                      ? item.ingredients.join(", ") // Om ingredients är en array, anslut dem med kommatecken
                      : item.ingredients}{" "}
                    {/* Om ingredients är en sträng, visa den */}
                    <hr />
                  </span>
                </li>
              ))
          : status === "succeeded" && <p>No menu items available.</p>}{" "}
        {/* Om ingen menydata finns, visa meddelande */}
        {/* Visar sektionen för Drycker */}
        <h2>Dryck ...... 19 SEK</h2>
        <div className="menu-drink">
          {items
            .filter((item) => item.type === "drink") // Filtrerar endast drycker
            .map((drink) => (
              <p
                key={drink.id}
                className="menu-sauce-dip"
                onClick={() => handleAddToCart(drink)} // Lägger till drycken i kundvagnen när den klickas
              >
                {drink.name} {/* Visar dryckens namn */}
              </p>
            ))}
        </div>
        <hr />
        {/* Visar sektionen för Dipsåser */}
        <h2>Dipsås ...... 19 SEK</h2>
        <div className="menu-sauce">
          {items
            .filter((item) => item.type === "dip") // Filtrerar endast dipsåser
            .map((dip) => (
              <p
                key={dip.id}
                className="menu-sauce-dip"
                onClick={() => handleAddToCart(dip)} // Lägger till dipsåsen i kundvagnen när den klickas
              >
                {dip.name} {/* Visar dipsåsens namn */}
              </p>
            ))}
        </div>
      </ul>
    </div>
  );
};

export default Menu; // Exporterar Menu-komponenten så den kan användas i andra delar av appen
