import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/ErrorPage.css";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  const navigate = useNavigate();

  return (
    <div id="error-page">
      <h1>Hiba történt!</h1>
      <button onClick={() => navigate("/")}>Vissza a főoldalra</button>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default ErrorPage;
