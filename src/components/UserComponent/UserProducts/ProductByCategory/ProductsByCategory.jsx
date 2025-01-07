import clsx from "clsx";
import styles from "./Products.module.css";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  addToCart,
  getCategoryListForCus,
  getFoodListForCus,
} from "../../../../api";
import { useNavigate, useParams } from "react-router-dom";
import { generateSlug } from "../../../../generateSlug";
import { formatCurrency } from "../../../../formatCurrency";
import ReactStars from "react-stars";
import { saveProductToLocalStorage } from "../../../../setGetRecentProduct";
import AddShoppingCartSharpIcon from "@mui/icons-material/AddShoppingCartSharp";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";
import { toast } from "react-toastify";
import { AddToCartContext } from "../../../../contexts/AddToCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

const ProductsByCategory = () => {
  const { cateId, slug } = useParams();
  const [results, setResults] = useState([]);
  const [products, setProducts] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const { setAddNew } = useContext(AddToCartContext);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [cateById, setCateById] = useState({});
  const navigate = useNavigate();

  const fetchResult = useCallback(async () => {
    try {
      const data = await getCategoryListForCus();
      const cateById = await getCategoryListForCus(cateId);
      setResults(data.$values || []);
      setCateById(cateById.$values[0]);
      // Kiểm tra nếu slug không khớp với cateById.categoryName
      if (slug !== generateSlug(cateById.$values[0].categoryName)) {
        navigate("/not-found");
      }
      console.log("Categories result: ", data);
      console.log("Categories by Id result: ", cateById.$values[0]);
    } catch (error) {
      console.error("Có lỗi xảy ra: ", error);
    }
  }, [cateId, slug, navigate]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  useEffect(() => {
    const fetchProductsResult = async () => {
      try {
        const data = await getFoodListForCus(
          null,
          cateId,
          null,
          page,
          pageSize
        );
        setProducts(data.items.$values || []);
        setTotalPages(data.totalPages);
        console.log("products result: ", data);
      } catch (error) {
        console.log("co loi xay ra: ", error);
      }
    };
    fetchProductsResult();
  }, [page, pageSize, cateId]);

  const handleAddToCart = async (id) => {
    try {
      const data = await addToCart(id);
      toast.success("Thêm vào giỏ hàng thành công!");
      setAddNew((prev) => !prev);
      console.log("products result: ", data);
    } catch (error) {
      console.log("co loi xay ra: ", error);
      if (error.response.status === 401) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        return;
      }
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className={clsx(styles["products"])}>
      <Helmet>
        <title>Sản Phẩm Theo Danh Mục</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
      <div className="row">
        {/* Categories Sidebar */}
        <div className="col-md-2 border-end">
          <div className={clsx(styles["categories"])}>
            <h4 className="fw-bold mb-3">Categories</h4>
            <ul className="list-unstyled">
              <li className={clsx(styles["categoryItem"], "mb-1")}>
                <a
                  href={`/products`}
                  className={clsx(
                    styles["categoryItem"],
                    "text-decoration-none text-dark"
                  )}
                >
                  Tất Cả
                </a>
              </li>
              {results.map((item, index) => (
                <li
                  key={index}
                  className={clsx(styles["categoryItem"], "mb-1")}
                >
                  <a
                    href={`/products/product-by-category/${item.categoryID}/${generateSlug(item.categoryName)}`}
                    className={clsx(
                      styles["categoryItem"],
                      "text-decoration-none text-dark"
                    )}
                  >
                    {item.categoryName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product List */}
        <div className="col-md-10">
          <div>
            <h3 className="fw-bold">Sản Phẩm</h3>
            <h6 className="mb-5 ms-3">
              Lọc Theo:{" "}
              <span className=" text-danger">{cateById.categoryName}</span>
            </h6>
          </div>
          <div className="row g-4">
            {products.map((product) => (
              <>
                <a
                  href={`/products/product-detail/${product.productId}/${generateSlug(product.productName)}`}
                  className="text-decoration-none text-black col-md-3"
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
                        <a
                          title="Chi tiết sản phẩm"
                          href={`/products/product-detail/${product.productId}/${generateSlug(product.productName)}`}
                          className={clsx(styles["link-popup"])}
                          onClick={() => {
                            saveProductToLocalStorage(product.productId); // Gọi hàm thay vì gán giá trị
                          }}
                        >
                          <CropFreeOutlinedIcon />
                        </a>
                      </div>
                    </div>
                    <h3 className={styles.productName}>
                      {product.productName}
                    </h3>
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
                      {product.price && (
                        <span className={styles.oldPrice}>
                          {formatCurrency(product.price)}
                        </span>
                      )}
                      <span className={styles.newPrice}>
                        {formatCurrency(product.discountedPrice)}
                      </span>
                    </div>
                  </div>
                </a>
              </>
            ))}
          </div>
          <div>
            <div className="d-flex justify-content-center mt-4">
              <div className="d-flex justify-content-center mt-4">
                <button
                  className={clsx(styles["pagination-button"], "me-1")}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {renderPaginationButtons(page, totalPages, setPage)}
                <button
                  className={clsx(styles["pagination-button"], "ms-1")}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const renderPaginationButtons = (page, totalPages, setPage) => {
  const buttons = [];
  const maxButtons = 5; // Số nút tối đa hiển thị

  let startPage = Math.max(page - Math.floor(maxButtons / 2), 1);
  let endPage = Math.min(startPage + maxButtons - 1, totalPages);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <button
        key={i}
        className={clsx(
          styles["pagination-button"],
          page === i && styles["active"],
          i !== endPage && "me-1"
        )}
        onClick={() => setPage(i)}
      >
        {i}
      </button>
    );
  }

  return buttons;
};

export default ProductsByCategory;
