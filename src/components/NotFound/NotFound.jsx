import clsx from "clsx";
import styles from "./NotFound.module.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={clsx(styles["big-div"])}>
      <div className={clsx(styles["not-found"])}>
        <img
          src="/src/assets/undraw_page_not_found_re_e9o6.svg"
          alt="403 Forbidden"
        />
        <h1>404 - NotFound</h1>
        <p>
          Sorry, this page could not be found. It may have been deleted or the
          address changed.
        </p>
        <button
          className={clsx(styles["go-home"])}
          onClick={() => navigate("/home")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
