import { useLocation } from "react-router-dom";
import styles from "./EmailFailure.module.css";

const EmailFailure = () => {
  const location = useLocation();

  // Lấy message từ query string
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get("message") || "Có lỗi xảy ra.";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#fff"
            width="50px"
            height="50px"
          >
            <circle cx="12" cy="12" r="10" fill="#fc4c00" />
            <line x1="8" y1="8" x2="16" y2="16" stroke="#fff" strokeWidth="2" />
            <line x1="16" y1="8" x2="8" y2="16" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
        <h1 className={styles.title}>Xác Thực Email Thất Bại!</h1>
        <p className={styles.message}>{errorMessage}</p>
        <button
          className={styles.button}
          onClick={() => (window.location.href = "/home")}
        >
          Trang Chủ
        </button>
      </div>
    </div>
  );
};

export default EmailFailure;
