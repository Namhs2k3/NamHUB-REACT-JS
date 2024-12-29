import { useContext, useEffect, useState } from "react";
import styles from "./OrderSummary.module.css";
import { useNavigate } from "react-router-dom";
import { getCartItems } from "../../../../api";
import { formatCurrency } from "../../../../formatCurrency";
import PropTypes from "prop-types";
import { CartAmountContext } from "../../../../contexts/CartAmountContext";

const OrderSummary = ({ discountCode }) => {
  const { setTotalAmount } = useContext(CartAmountContext);
  const [products, setProducts] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const totalAmount = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  setTotalAmount(totalAmount);
  const [totalAmountAfterDiscount, setTotalAmountAfterDiscount] =
    useState(totalAmount);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchUserCartItems = async () => {
      try {
        const data = await getCartItems();
        console.log("User cart items: ", data);
        setProducts(data.$values || []);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      }
    };

    fetchUserCartItems();
  }, [navigate]);

  useEffect(() => {
    console.log("discountCode[0]: ", discountCode[0]);
    const calculateTotalAmount = () => {
      let result = totalAmount;
      let amount = 0;
      console.log("amount: ", amount, "result: ", result);
      if (discountCode.length > 0) {
        if (discountCode[0].discountType === "amount") {
          amount = discountCode[0].discountValue;
          result = totalAmount - amount;
          console.log("amount1: ", amount, "result1: ", result);
        } else if (discountCode[0].discountType === "percent") {
          amount = totalAmount * (discountCode[0].discountValue / 100);
          result = totalAmount - amount;
          console.log("amount2: ", amount, "result2: ", result);
        }
      }
      setDiscountAmount(amount > totalAmount ? totalAmount : amount);
      setTotalAmountAfterDiscount(result < 0 ? 0 : result);
    };

    calculateTotalAmount();
  }, [totalAmount, discountCode]);

  return (
    <div className={styles.orderSummary}>
      <h2 className={styles.title}>Đơn Đặt Hàng</h2>
      <div className={styles.table}>
        <div className={styles.header}>
          <span className={styles.columnProduct}>Sản phẩm</span>
          <span className={styles.columnPrice}>Tạm tính</span>
        </div>
        <div className={styles.items}>
          {products.map((product) => (
            <div className={styles.row} key={product.cartId}>
              <div className={styles.productDetails}>
                <img
                  src={`${baseUrl}${product.imageUrl}`}
                  alt={product.name}
                  className={styles.image}
                />
                <div>
                  <p className={styles.productName}>{product.productName}</p>

                  <p className={styles.seller}>
                    {formatCurrency(product.discountedPrice)}
                  </p>
                  <p className={styles.quantity}>x {product.quantity}</p>
                </div>
              </div>
              <div className={styles.price}>
                {formatCurrency(product.discountedPrice * product.quantity)}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <div className={styles.subtotalRow}>
            <span className={styles.label}>Tạm tính</span>
            <span className={styles.value}>{formatCurrency(totalAmount)}</span>
          </div>
          <div className={styles.shippingRow}>
            <span className={styles.label}>Giảm giá:</span>
            <span className={styles.value}>
              {formatCurrency(discountAmount)}
            </span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.label}>Tổng</span>
            <span className={styles.value}>
              {formatCurrency(totalAmountAfterDiscount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
OrderSummary.propTypes = {
  discountCode: PropTypes.array,
};
export default OrderSummary;
