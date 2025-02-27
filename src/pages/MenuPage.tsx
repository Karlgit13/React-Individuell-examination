import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiKey, fetchMenu } from "../store/menuSlice";
import { RootState, AppDispatch } from "../store";

const MenuPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, apiKey, apiKeyStatus } = useSelector(
    (state: RootState) => state.menu
  );

  useEffect(() => {
    if (!apiKey && apiKeyStatus === "idle") {
      dispatch(fetchApiKey());
    }
  }, [apiKey, apiKeyStatus, dispatch]);

  useEffect(() => {
    if (apiKey && apiKeyStatus === "succeeded" && status === "idle") {
      dispatch(fetchMenu());
    }
  }, [apiKey, apiKeyStatus, status, dispatch]);

  return (
    <div>
      <h1>Yum Yum Gimme Sum - Menu</h1>
      {status === "loading" && <p>Loading menu...</p>}
      {status === "failed" && <p>Failed to load menu</p>}
      <ul>
        {Array.isArray(items) ? (
          items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.price} kr
            </li>
          ))
        ) : (
          <p>Menu is not available.</p>
        )}
      </ul>
    </div>
  );
};

export default MenuPage;
