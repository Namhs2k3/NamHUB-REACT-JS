import { useEffect, useState } from "react";
import styles from "./ProductDetail.module.css";
import { useParams } from "react-router-dom";
import { saveProductToLocalStorage } from "../../../../setGetRecentProduct";
import { getFoodListForCus } from "../../../../api";
import ReactStars from "react-stars";

const ProductDetail = () => {
  const { id } = useParams();
  if (id) {
    saveProductToLocalStorage(Number(id));
  }
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [product, setProduct] = useState({
    productName: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    isPopular: false,
    rating: 0,
    ratingCount: 0,
    price: 0,
    discountedPrice: 0,
    discountPercentage: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFoodListForCus(null, null, id);
        setProduct(data.items.$values[0] || {});
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className={styles.productDetail}>
      {/* Image Section */}
      <div className={styles.imageSection}>
        <img
          src={`${baseUrl}${product.imageUrl}`}
          alt={product.productName || "Product Image"}
          className={styles.productImage}
        />
        {product.isPopular && (
          <span className={styles.popularTag}>Phổ biến</span>
        )}
        {product.discountPercentage > 0 && (
          <div className={styles.discountBadge}>
            {product.discountPercentage}% off
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className={styles.infoSection}>
        <h1 className={styles.title}>{product.productName}</h1>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.ratingSection}>
          <ReactStars
            count={5}
            value={product.rating}
            size={24}
            color2={"#ffb400"}
            edit={false}
          />
          <span className={styles.ratingCount}>
            {product.ratingCount} đánh giá
          </span>
        </div>

        <div className={styles.priceSection}>
          <p className={styles.originalPrice}>
            {product.price.toLocaleString()}₫
          </p>
          <p className={styles.currentPrice}>
            {product.discountedPrice.toLocaleString()}₫
          </p>
        </div>

        <div className={styles.actionSection}>
          <button className={styles.addToCart}>Thêm vào giỏ</button>
          <button className={styles.buyNow}>Mua ngay</button>
        </div>

        <div className={styles.metaSection}>
          <p>Danh mục: {product.categoryName}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
