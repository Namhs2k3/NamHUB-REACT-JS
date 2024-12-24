import clsx from "clsx";
import styles from "./Unauth.module.css";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className={clsx(styles["big-div"])}>
      <div className={clsx(styles["not-found"])}>
        <img src="/src/assets/undraw_safe_re_kiil.svg" alt="403 Forbidden" />
        <h1>403 - Forbidden</h1>
        <p>Oops! You don&apos;t have permission to access this page.</p>
        <button
          className={clsx(styles["go-home"])}
          onClick={() => navigate("/login")}
        >
          Log in as Admin
        </button>
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

export const Unauthenticated = () => {
  const navigate = useNavigate();
  return (
    <div className={clsx(styles["big-div"])}>
      <div className={clsx(styles["not-found"])}>
        <img
          src="/src/assets/undraw_mobile_login_re_9ntv.svg"
          alt="403 Forbidden"
        />
        <h1>401 - Unauthorized</h1>
        <p>Oh! You must be logged-in to access this page!</p>
        <button
          className={clsx(styles["go-home"])}
          onClick={() => navigate("/login")}
        >
          Log-in
        </button>
      </div>
    </div>
  );
};
