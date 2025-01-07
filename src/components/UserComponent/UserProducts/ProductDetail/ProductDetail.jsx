import { useContext, useEffect, useState } from "react";
import styles from "./ProductDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { saveProductToLocalStorage } from "../../../../setGetRecentProduct";
import { addToCart, getFoodListForCus } from "../../../../api";
import ReactStars from "react-stars";
import { toast } from "react-toastify";
import { AddToCartContext } from "../../../../contexts/AddToCartContext";
import ProductReview from "./ProductReview";
import { generateSlug } from "../../../../generateSlug";
import RelatedProduct from "./RelatedProduct";
import { Helmet } from "react-helmet";

const ProductDetail = () => {
  const { id, slug } = useParams();
  if (id) {
    saveProductToLocalStorage(Number(id));
  }
  const navigate = useNavigate();
  const { setAddNew } = useContext(AddToCartContext);
  const [isReload, setReload] = useState(false);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [product, setProduct] = useState({
    productId: 34,
    productName: "Cà Phê Đen",
    description:
      "Cà phê đen đậm đà, thơm ngon, pha chế từ hạt cà phê rang xay tươi.",
    imageUrl: "/images/Food/drink-cafe-den.png",
    categoryId: 5,
    categoryName: "Thức Uống",
    isHidden: false,
    isPopular: false,
    rating: 5,
    ratingCount: 1,
    comments: {
      $id: "",
      $values: [
        {
          $id: "",
          ratingId: 0,
          productId: 0,
          userId: 0,
          rating: 0,
          comment: "",
          createdAt: "",
          updatedAt: "",
          product: null,
          user: null,
        },
      ],
    },
    price: 40000,
    discountedPrice: 0,
    discountPercentage: 100,
  });

  const [commentList, setCommentList] = useState([]);
  const [currentUserComment, setCurrentUserComment] = useState({});

  const handleAddToCart = async () => {
    try {
      await addToCart(id);
      setAddNew((prev) => !prev);
      toast.success("Thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFoodListForCus(null, null, id);
        if (generateSlug(data.items.$values[0].productName) === `${slug}`) {
          setProduct(data.items.$values[0] || {});
          setCommentList(
            data?.items?.$values?.[0]?.comments?.$values?.filter(
              (comment) => !comment.isCurrentUserComment
            ) || []
          );
          setCurrentUserComment(
            data.items.$values[0].comments.$values.find(
              (comment) => comment.isCurrentUserComment
            ) || {}
          );
        } else {
          navigate("/not-found");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchData();
  }, [id, slug, navigate, isReload]);

  return (
    <>
      <Helmet>
        <title>Chi Tiết Sản Phẩm</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
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
            <button className={styles.addToCart} onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
            <button className={styles.buyNow}>Mua ngay</button>
          </div>

          <div className={styles.metaSection}>
            <p>Danh mục: {product.categoryName}</p>
          </div>
        </div>
      </div>
      <ProductReview
        productId={id}
        commentList={commentList}
        existingReview={currentUserComment}
        setReload={setReload}
      ></ProductReview>
      <RelatedProduct categoryId={product.categoryId}></RelatedProduct>
    </>
  );
};

export default ProductDetail;
