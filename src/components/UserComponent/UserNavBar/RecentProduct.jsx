import clsx from "clsx";
import styles from "./UserNavBar.module.css";
import { useEffect, useState } from "react";
import { getFoodListForCus } from "../../../api";
import { generateSlug } from "../../../generateSlug";
import { useCallback } from "react";
import PropTypes from "prop-types";
import { getViewedProducts } from "../../../setGetRecentProduct";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

const RecentProducts = ({ setOpenRecent, isOpenRecent }) => {
  const [results, setResults] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const productsId = getViewedProducts();
  console.log("productsId", productsId);

  const fetchResult = useCallback(async () => {
    try {
      const data = await getFoodListForCus();
      setResults(data.items.$values || []);
      console.log("recent products result: ", data);
    } catch (error) {
      console.error("Có lỗi xảy ra: ", error);
    }
  }, []);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  const main = document.getElementById("root");
  const handleRecentProdBlur = () => {
    setOpenRecent(false);
    main.classList.remove("body-no-scroll");
  };

  return (
    <>
      <div className={clsx(styles.bigDiv)}></div>
      <CSSTransition
        in={isOpenRecent}
        timeout={300}
        classNames={{
          enter: styles["popup-enter"],
          enterActive: styles["popup-enter-active"],
          exit: styles["popup-exit"],
          exitActive: styles["popup-exit-active"],
        }}
        unmountOnExit
      >
        <div
          className={clsx(styles.recentProducts)}
          onMouseLeave={handleRecentProdBlur}
        >
          {productsId && productsId.length > 0 ? (
            <div className={styles["product-gallery"]}>
              {productsId.map((id, index) => {
                const product = results.find((item) => item.productId === id);
                if (!product) return null; // Nếu không tìm thấy sản phẩm, bỏ qua

                return (
                  <a
                    key={index}
                    title={product.productName}
                    href={`/products/product-detail/${product.productId}/${generateSlug(
                      product.productName
                    )}`}
                    className={styles["product-item"]}
                  >
                    <img
                      src={`${baseUrl}${product.imageUrl}`}
                      alt={`Product ${index + 1}`}
                    />
                  </a>
                );
              })}
            </div>
          ) : (
            <div className={clsx(styles.emptyCartContainer)}>
              <div className={clsx(styles.iconEmpty)}>
                <img
                  src="/src/assets/undraw_no-data_ig65.svg"
                  alt="Giỏ hàng trống"
                  className={clsx(styles.imageEmpty)}
                />
              </div>
              <p className={clsx(styles.message)}>
                Không có sản phẩm nào đã xem gần đây
              </p>
              <Link to="/products" className={clsx(styles.continueShopping)}>
                Tiếp tục xem
              </Link>
            </div>
          )}
        </div>
      </CSSTransition>
    </>
  );
};

RecentProducts.propTypes = {
  setReload: PropTypes.func,
  setOpenRecent: PropTypes.func,
  isOpenRecent: PropTypes.bool,
};

export default RecentProducts;
