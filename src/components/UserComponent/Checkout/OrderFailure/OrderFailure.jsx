import { useLocation } from "react-router-dom";
import styles from "./OrderFailure.module.css";

const OrderFailure = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <span>&#10007;</span>
        </div>
        <h1 className={styles.title}>Đặt hàng thất bại!</h1>
        <p className={styles.message}>
          Chúng tôi rất tiếc, đơn hàng của bạn không thể được xử lý.
        </p>
        {orderId && (
          <p className={styles.orderId}>
            Mã đơn hàng của bạn là: <span>{orderId}</span>
          </p>
        )}
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

export default OrderFailure;
