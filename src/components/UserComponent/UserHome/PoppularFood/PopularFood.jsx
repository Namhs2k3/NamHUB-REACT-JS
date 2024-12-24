import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation } from "swiper/modules";
import styles from "./PopularFood.module.css";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { addToCart, getPopularProductsForCus } from "../../../../api";
import { formatCurrency } from "../../../../formatCurrency";
import ReactStars from "react-stars";
import clsx from "clsx";
import { Link } from "react-router-dom";
import AddShoppingCartSharpIcon from "@mui/icons-material/AddShoppingCartSharp";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";
import { generateSlug } from "../../../../generateSlug";
import { toast } from "react-toastify";
import { AddToCartContext } from "../../../../contexts/AddToCartContext";
import { saveProductToLocalStorage } from "../../../../setGetRecentProduct";

const PopularFood = () => {
  const { setAddNew } = useContext(AddToCartContext);
  const [products, setProducts] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const handleAddToCart = async (id) => {
    try {
      const data = await addToCart(id);
      toast.success("Thêm vào giỏ hàng thành công!");
      setAddNew((prev) => !prev);
      console.log("products result: ", data);
    } catch (error) {
      console.log("co loi xay ra: ", error);
      if (error.response.status === 404) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        return;
      }
      toast.error("Có lỗi xảy ra");
    }
  };
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getPopularProductsForCus();
        setProducts(data.items.$values || []);
        console.log("products result: ", data);
      } catch (error) {
        console.log("co loi xay ra: ", error);
      }
    };
    fetchResult();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Sản Phẩm Bán Chạy</h2>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={5}
        navigation
        breakpoints={{
          640: {
            slidesPerView: 2, // Hiển thị 2 slide khi màn hình ≥ 640px
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3, // Hiển thị 3 slide khi màn hình ≥ 768px
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 5, // Hiển thị 4 slide khi màn hình ≥ 1024px
            spaceBetween: 0,
          },
        }}
        className={styles.swiper}
      >
        {products.map((product) => (
          <SwiperSlide key={product.productId} className={styles.slide}>
            <Link
              to={`/products/product-detail/${product.productId}/${generateSlug(product.productName)}`}
              className="text-decoration-none text-black"
              onClick={() => {
                saveProductToLocalStorage(product.productId); // Gọi hàm thay vì gán giá trị
              }}
            >
              <div className={styles.productCard}>
                {product.discountPercentage > 0 && (
                  <div className={styles.discountBadge}>
                    {product.discountPercentage}% off
                  </div>
                )}

                {/* Badge sản phẩm nổi bật */}
                {product.isPopular && (
                  <div className={styles.featuredBadge}>Nổi bật</div>
                )}
                <div className="position-relative">
                  <img
                    src={`${baseUrl}${product.imageUrl}`}
                    alt={product.productName}
                    className={styles.productImage}
                  />
                  <div className={clsx(styles["img-popup"])}>
                    <button
                      title="Thêm vào giỏ hàng"
                      className={clsx(styles["btn-popup"])}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product.productId);
                      }}
                    >
                      <AddShoppingCartSharpIcon />
                    </button>
                    <Link
                      title="Chi tiết sản phẩm"
                      to={`/products/product-detail/${product.productId}/${generateSlug(product.productName)}`}
                      className={clsx(styles["link-popup"])}
                      onClick={() => {
                        saveProductToLocalStorage(product.productId); // Gọi hàm thay vì gán giá trị
                      }}
                    >
                      <CropFreeOutlinedIcon />
                    </Link>
                  </div>
                </div>
                <h3 className={styles.productName}>{product.productName}</h3>
                <div className={styles.rating}>
                  <ReactStars
                    count={5}
                    value={product.rating}
                    size={20}
                    color2={"#ffd700"} // Màu sao vàng
                    edit={false} // Để không cho người dùng chỉnh sửa
                  />
                  <span className={styles.ratingCount}>
                    {product.ratingCount}
                  </span>
                </div>
                <div className={styles.priceContainer}>
                  {product.price && product.discountPercentage > 0 && (
                    <span className={styles.oldPrice}>
                      {formatCurrency(product.price)}
                    </span>
                  )}
                  <span className={styles.newPrice}>
                    {formatCurrency(product.discountedPrice)}
                  </span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default PopularFood;
