import clsx from "clsx";
import styles from "./Unauth.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceDizzy } from "@fortawesome/free-solid-svg-icons";

export const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className={clsx(styles["big-div"])}>
      <div className={clsx(styles["not-found"])}>
        <FontAwesomeIcon
          icon={faFaceDizzy}
          className={clsx(styles["sad"], "mb-5")}
        />
        403 - Forbidden
        <button
          className={clsx(styles["go-home"])}
          onClick={() => navigate("/login")}
        >
          Đăng Nhập Bằng Tài Khoản Admin
        </button>
        <button
          className={clsx(styles["go-home"])}
          onClick={() => navigate("/home")}
        >
          Trang Chủ
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
        <FontAwesomeIcon
          icon={faFaceDizzy}
          className={clsx(styles["sad"], "mb-5")}
        />
        401 - Unauthorized
        <button
          className={clsx(styles["go-home"])}
          onClick={() => navigate("/login")}
        >
          Đăng Nhập
        </button>
      </div>
    </div>
  );
};
