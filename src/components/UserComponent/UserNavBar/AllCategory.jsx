import clsx from "clsx";
import styles from "./UserNavBar.module.css";
import { useEffect, useState } from "react";
import { getCategoryListForCus } from "../../../api";
import { generateSlug } from "../../../generateSlug";
import { useCallback } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";

const AllCategory = ({ isOpenCategory }) => {
  const [results, setResults] = useState([]);
  const fetchResult = useCallback(async () => {
    try {
      const data = await getCategoryListForCus();
      setResults(data.$values || []);
      console.log("Categories result: ", data);
    } catch (error) {
      console.error("Có lỗi xảy ra: ", error);
    }
  }, []);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  return (
    <>
      <div className={clsx(styles.bigDiv)}></div>
      <CSSTransition
        in={isOpenCategory}
        timeout={300}
        classNames={{
          enter: styles["popup-enter"],
          enterActive: styles["popup-enter-active"],
          exit: styles["popup-exit"],
          exitActive: styles["popup-exit-active"],
        }}
        unmountOnExit
      >
        <div className={clsx(styles.categories)}>
          {results && results.length > 0 ? (
            <>
              <ul className={styles.listCategory}>
                {results.map((item) => (
                  <li key={item.id} className={clsx(styles.cartItem)}>
                    <img
                      src={`${item.imgURL}`}
                      alt={item.name}
                      className={clsx(styles.imageCategory)}
                    />
                    <div className={clsx(styles.itemDetails)}>
                      <a
                        href={`/products/product-by-category/${item.categoryID}/${generateSlug(item.categoryName)}`}
                        className={clsx(styles.name)}
                      >
                        {item.categoryName}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
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
              <a href="/shop" className={clsx(styles.continueShopping)}>
                Tiếp tục mua hàng
              </a>
            </div>
          )}
        </div>
      </CSSTransition>
    </>
  );
};
AllCategory.propTypes = {
  setReload: PropTypes.func,
  isOpenCategory: PropTypes.bool,
};
export default AllCategory;
