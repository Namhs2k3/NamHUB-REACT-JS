import { useState } from "react";
import styles from "./FoodCategory.module.css";
import { useEffect } from "react";
import { getCategoryListForCus } from "../../../../api";
import { generateSlug } from "../../../../generateSlug";

const FoodCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getCategoryListForCus();
        setCategories(data.$values || []);
        console.log("cate result: ", data);
      } catch (error) {
        console.log("co loi xay ra: ", error);
      }
    };
    fetchResult();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        DANH MỤC SẢN PHẨM{" "}
        <span>
          <a href={`/products`} className={styles.allProducts}>
            Tất cả sản phẩm
          </a>
        </span>
      </h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <a
            href={`/products/product-by-category/${category.categoryID}/${generateSlug(category.categoryName)}`}
            key={category.categoryID}
            className={styles.categoryCard}
          >
            <img
              src={category.imgURL}
              alt={category.categoryName}
              className={styles.categoryImage}
            />
            <p className={styles.categoryName}>{category.categoryName}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FoodCategory;
