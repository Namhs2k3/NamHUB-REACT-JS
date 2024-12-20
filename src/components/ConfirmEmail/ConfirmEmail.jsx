import clsx from "clsx";
import { Link } from "react-router-dom";
import styles from "./ConfirmEmail.module.css";
const ConfirmEmail = () => {
  return (
    <div className={clsx(styles["main-div"])}>
      <div className={clsx(styles["div-confirm"])}>
        <p className={clsx(styles["p-confirm"])}>
          Nhấp vào liên kết được gửi đến email{" "}
          <span className={clsx(styles["email"])}>
            {localStorage.getItem("email")}
          </span>{" "}
          để xác thực tài khoản!
        </p>
        <p>
          Đã xác thực?{" "}
          <span>
            <Link to="/login" style={{ color: "#fc4c00" }}>
              Đến Trang Đăng nhập
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};
export default ConfirmEmail;
