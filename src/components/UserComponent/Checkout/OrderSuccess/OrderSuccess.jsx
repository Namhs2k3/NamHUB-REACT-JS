import { useLocation } from "react-router-dom";
import styles from "./OrderSuccess.module.css";

const OrderSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <span>&#10003;</span>
        </div>
        <h1 className={styles.title}>Đặt hàng thành công!</h1>
        <p className={styles.message}>
          Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
        </p>
        <p className={styles.orderId}>#{orderId}</p>
        <button
          className={styles.button}
          onClick={() => (window.location.href = "/")}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
