import clsx from "clsx";
import styles from "./UserNavBar.module.css";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getFoodListForCus } from "../../../api";
import { generateSlug } from "../../../generateSlug";
import { saveProductToLocalStorage } from "../../../setGetRecentProduct";
import { CSSTransition } from "react-transition-group";

const SearchResult = ({ name, cateId, isOpenResult }) => {
  const [results, setResults] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getFoodListForCus(name, cateId);
        setResults(data.items.$values || []);
        console.log("search result: ", data);
      } catch (error) {
        console.log("co loi xay ra: ", error);
      }
    };
    fetchResult();
  }, [name, cateId]);
  return (
    <>
      <div className={clsx(styles.bigDiv)}></div>
      <CSSTransition
        in={isOpenResult}
        timeout={300}
        classNames={{
          enter: styles["popup-enter"],
          enterActive: styles["popup-enter-active"],
          exit: styles["popup-exit"],
          exitActive: styles["popup-exit-active"],
        }}
        unmountOnExit
      >
        <div className={clsx(styles.searchResult)}>
          {results && results.length > 0 ? (
            <>
              <div className={styles.header}>
                <span>{results.length} results found</span>
              </div>
              <ul className={styles.list}>
                {results.map((item) => (
                  <a
                    href={`/products/product-detail/${item.productId}/${generateSlug(item.productName)}`}
                    key={item.id}
                    className={styles.product}
                    onClick={() => {
                      saveProductToLocalStorage(item.productId); // Gọi hàm thay vì gán giá trị
                    }}
                  >
                    <li className={styles.item}>
                      <img
                        src={`${baseUrl}${item.imageUrl}`}
                        alt={item.productName}
                        className={styles.image}
                      />
                      <div className={styles.details}>
                        <a
                          href={`/products/product-detail/${item.productId}/${generateSlug(item.productName)}`}
                          className={styles.name}
                          onClick={() => {
                            saveProductToLocalStorage(item.productId); // Gọi hàm thay vì gán giá trị
                          }}
                        >
                          {item.productName}
                          {item.discountPercentage > 0 ? (
                            <span className={styles.discount}>
                              {item.discountPercentage}%
                            </span>
                          ) : null}
                        </a>
                        {item.discountPercentage > 0 ? (
                          <span className={styles.price}>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)}
                          </span>
                        ) : null}
                        <span className={styles.discountedPrice}>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.discountedPrice)}
                        </span>
                      </div>
                    </li>
                  </a>
                ))}
              </ul>
            </>
          ) : (
            <ul className={styles.list}>
              <li className={styles.item}>
                <span>Không tìm thấy sản phẩm nào</span>
              </li>
            </ul>
          )}
        </div>
      </CSSTransition>
    </>
  );
};

SearchResult.propTypes = {
  name: PropTypes.string,
  cateId: PropTypes.string,
  isOpenResult: PropTypes.bool,
};

export default SearchResult;
