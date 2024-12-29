import clsx from "clsx";
import styles from "./UserNavBar.module.css";
import { useEffect, useState } from "react";
import {
  decreaseCartItem,
  getCartItems,
  increaseCartItem,
  removeCartItem,
} from "../../../api";
import { generateSlug } from "../../../generateSlug";
import { formatCurrency } from "../../../formatCurrency";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import PropTypes from "prop-types";
import { saveProductToLocalStorage } from "../../../setGetRecentProduct";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

const CartItems = ({ setReload, isOpenCart }) => {
  const [results, setResults] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const fetchResult = useCallback(async () => {
    try {
      const data = await getCartItems();
      setResults(data.$values || []);
      console.log("Cart Items result: ", data);
    } catch (error) {
      console.error("Có lỗi xảy ra: ", error);
    }
  }, []);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  const totalAmount = results.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleDecrease = async (id) => {
    try {
      await decreaseCartItem(id);
      fetchResult();
      setReload((prev) => !prev);
    } catch (error) {
      console.log("lỗi khi giảm: ", error);
    }
  };
  const handleIncrease = async (id) => {
    try {
      await increaseCartItem(id);
      fetchResult();
      setReload((prev) => !prev);
    } catch (error) {
      console.log("lỗi khi tăng: ", error);
    }
  };
  const handleRemove = (id) => {
    setItemToRemove(id); // Lưu lại id của sản phẩm cần xóa
    setShowConfirmModal(true); // Hiển thị modal xác nhận
  };

  const confirmRemove = async () => {
    try {
      await removeCartItem(itemToRemove);
      fetchResult();
      setShowConfirmModal(false); // Ẩn modal sau khi xóa thành công
      setReload((prev) => !prev);
    } catch (error) {
      console.log("lỗi khi xóa: ", error);
    }
  };

  const cancelRemove = () => {
    setShowConfirmModal(false); // Đóng modal nếu người dùng hủy bỏ
  };
  return (
    <>
      <div className={clsx(styles.bigDiv)}></div>
      <CSSTransition
        in={isOpenCart}
        timeout={300}
        classNames={{
          enter: styles["popup-enter"],
          enterActive: styles["popup-enter-active"],
          exit: styles["popup-exit"],
          exitActive: styles["popup-exit-active"],
        }}
        unmountOnExit
      >
        <div className={clsx(styles.cartItems)}>
          {results && results.length > 0 ? (
            <>
              <ul className={styles.list}>
                {results.map((item) => (
                  <li key={item.id} className={clsx(styles.cartItem)}>
                    <img
                      src={`${baseUrl}${item.imageUrl}`}
                      alt={item.name}
                      className={clsx(styles.image)}
                    />
                    <div className={clsx(styles.itemDetails)}>
                      <a
                        href={`/products/product-detail/${item.productId}/${generateSlug(item.productName)}`}
                        className={clsx(styles.name)}
                        onClick={() => {
                          saveProductToLocalStorage(item.productId); // Gọi hàm thay vì gán giá trị
                        }}
                      >
                        {item.productName}
                      </a>
                      <div className={clsx(styles.quantityControl)}>
                        <button
                          className={clsx(styles.decreaseButton)}
                          onClick={() => handleDecrease(item.productId)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className={clsx(styles.quantity)}>
                          {item.quantity}
                        </span>
                        <button
                          className={clsx(styles.increaseButton)}
                          onClick={() => handleIncrease(item.productId)}
                        >
                          +
                        </button>
                        <span className={clsx(styles.discountedPrice, "ms-3")}>
                          {"x"}
                          {formatCurrency(item.discountedPrice)}
                        </span>
                      </div>
                    </div>
                    <button
                      className={clsx(styles.deleteButton)}
                      onClick={() => handleRemove(item.productId)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className={clsx(styles.summary)}>
                <p className={clsx(styles.total)}>
                  Tạm tính:{" "}
                  <span className={styles.totalPrice}>
                    {formatCurrency(totalAmount)}
                  </span>
                </p>
                <div className={clsx(styles.actionButtons)}>
                  <button
                    onClick={() => {
                      window.location.href = "/checkout";
                    }}
                    className={clsx(styles.checkoutButton)}
                  >
                    Thanh Toán
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={clsx(styles.emptyCartContainer)}>
              <div className={clsx(styles.iconEmpty)}>
                <img
                  src="/src/assets/undraw_empty-cart_574u.svg" // Thay bằng link ảnh hoặc SVG tương tự
                  alt="Giỏ hàng trống"
                  className={clsx(styles.imageEmpty)}
                />
              </div>
              <p className={clsx(styles.message)}>Giỏ hàng đang trống</p>
              <Link to="/products" className={clsx(styles.continueShopping)}>
                Tiếp tục mua hàng
              </Link>
            </div>
          )}
        </div>
      </CSSTransition>

      {showConfirmModal && (
        <div className={clsx(styles.confirmModal)}>
          <div className={clsx(styles.modalContent)}>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
            <button
              className={clsx(styles.confirmButton)}
              onClick={confirmRemove}
            >
              Xác nhận
            </button>
            <button
              className={clsx(styles.cancelButton)}
              onClick={cancelRemove}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );
};
CartItems.propTypes = {
  setReload: PropTypes.func,
  isOpenCart: PropTypes.bool,
};
export default CartItems;
