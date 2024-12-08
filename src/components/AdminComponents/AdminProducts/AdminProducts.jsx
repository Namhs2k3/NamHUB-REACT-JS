import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminProducts.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import {
  createProd,
  getCategoryList,
  getProdList,
  getProdListById,
  updateProd,
} from "../../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const generateSlug = (productName) => {
  // Loại bỏ dấu tiếng Việt
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Tách dấu ra khỏi chữ cái gốc
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
      .replace(/đ/g, "d") // Thay chữ "đ" thành "d"
      .replace(/Đ/g, "D"); // Thay chữ "Đ" thành "D"
  };

  return removeVietnameseTones(productName)
    .toLowerCase() // Chuyển thành chữ thường
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay dấu cách thành dấu gạch nối
    .replace(/-+/g, "-"); // Loại bỏ dấu gạch nối thừa
};

const AdminProduct = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [prodList, setProdList] = useState();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchProdListByName = async () => {
      setIsLoading(false);
      try {
        const data = await getProdList(searchTerm);
        console.log("Prod List: ", data);
        setProdList(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdListByName();
  }, [navigate, searchTerm]);

  return (
    <div className={clsx(styles["main-products"])}>
      <div>
        <Helmet>
          <title>Danh Sách Sản Phẩm</title>
          <meta name="description" content="Xem Danh Sách Các Sản Phẩm" />
          <meta
            name="keywords"
            content="sản phẩm, quản lý sản phẩm, danh sách, danh sách sản phẩm"
          />
          <meta property="og:title" content="Danh Sách Các Sản Phẩm" />
          <meta
            property="og:description"
            content="Xem Danh Sách Các Sản Phẩm"
          />
          <meta property="og:image" content="/src/assets/Logo.png" />
        </Helmet>
      </div>
      <AdminSideBar
        site="products"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["product"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-product-light" : "list-product-dark"]
            )}
          >
            <div className={clsx(styles["title"])}>DANH SÁCH SẢN PHẨM</div>
            <div className="d-flex justify-content-between align-items-center">
              <Link
                to="/admin/products/add-product"
                className="btn btn-success text-white mb-3"
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Thêm Món
              </Link>
              <div className={clsx(styles["search-container"])}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className={clsx(styles["search-input"])}
                />
              </div>
            </div>
            <div className={clsx(styles["div-table"])}>
              <table
                className={clsx(
                  styles["custom-table"],
                  "table table-striped table-hover table-responsive"
                )}
              >
                <thead className={clsx(styles["custom-thead"])}>
                  <tr>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Ảnh
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Tên
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Mô Tả
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Giá
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Danh Mục
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Phổ Biến
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Bị Ẩn
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Giá Sau Giảm
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      % Giảm
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Keywords
                    </th>
                    <th
                      scope="col"
                      style={{
                        verticalAlign: "middle",
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prodList?.$values?.map((item, index) => (
                    <tr key={item.productId}>
                      <th style={{ verticalAlign: "middle" }} scope="row">
                        {index + 1}
                      </th>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <img
                          src={item.imgURL || "../../../assets/Logo.png"}
                          alt={item.productName || "Default Image"}
                          className={clsx(styles["img"])}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.productName}
                      </td>
                      <td
                        style={{
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          verticalAlign: "middle",
                        }}
                      >
                        {item.description || "Không có mô tả"}
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.categoryName || "Không có danh mục"}
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          className={clsx(
                            styles["badge"],
                            styles[
                              item.isPopular
                                ? "badge-success"
                                : "badge-secondary"
                            ]
                          )}
                        >
                          {item.isPopular ? "Có" : "Không"}
                        </span>
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          className={clsx(
                            styles["badge"],
                            styles[
                              item.isHidden ? "badge-danger" : "badge-secondary"
                            ]
                          )}
                        >
                          {item.isHidden ? "Có" : "Không"}
                        </span>
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Intl.NumberFormat("vi-VN").format(
                          item.discountedPrice
                        )}
                        đ
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.discountPercentage || 0}%
                      </td>
                      <td
                        style={{
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          verticalAlign: "middle",
                        }}
                      >
                        {item.keywords || "Không có từ khóa"}
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Link
                          to={`/admin/products/edit-product/${generateSlug(item.productName)}/${item.productId}`}
                          className="btn btn-warning btn-sm"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} /> Sửa
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};

export const EditProduct = () => {
  const { id } = useParams();

  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [productDetails, setProductDetails] = useState({
    $id: "1",
    $values: [
      {
        $id: "",
        productId: 0,
        productName: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        categoryId: 0,
        categoryName: "",
        imgURL: "",
        isHidden: false,
        isPopular: false,
        discountedPrice: 0,
        discountPercentage: 0,
        keywords: null,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: productDetails.$values[0].productId || "",
    productName: productDetails.$values[0].productName || "",
    description: productDetails.$values[0].description || "",
    price: productDetails.$values[0].price || 0,
    categoryId: productDetails.$values[0].categoryId || 0,
    imgURL: productDetails.$values[0].imgURL || "",
    isHidden: productDetails.$values[0].isHidden || false,
    isPopular: productDetails.$values[0].isPopular || false,
    discountedPrice: productDetails.$values[0].discountedPrice || 0,
    keywords: productDetails.$values[0].keywords || "",
    stockQuantity: productDetails.$values[0].stockQuantity,
  });

  const [categoryList, setCategoryList] = useState({
    $id: "",
    $values: [
      {
        $id: "",
        categoryID: 0,
        categoryName: "",
        imgURL: "",
        description: null,
        keywords: null,
      },
    ],
  });

  useEffect(() => {
    const fetchCateList = async () => {
      try {
        const data = await getCategoryList();
        console.log("Cate lisst: ", data);
        setCategoryList(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCateList();
  }, [navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getProdListById(Number(id));
        console.log("Prod details: ", data);
        setProductDetails(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [navigate, id]);

  useEffect(() => {
    setFormData({
      productId: productDetails.$values[0].productId || "",
      productName: productDetails.$values[0].productName || "",
      description: productDetails.$values[0].description || "",
      price: productDetails.$values[0].price || 0,
      categoryId: productDetails.$values[0].categoryId || "",
      imgURL: productDetails.$values[0].imgURL || "",
      isHidden: productDetails.$values[0].isHidden || false,
      isPopular: productDetails.$values[0].isPopular || false,
      discountedPrice: productDetails.$values[0].discountedPrice || 0,
      keywords: productDetails.$values[0].keywords || "",
      stockQuantity: productDetails.$values[0].stockQuantity,
    });
  }, [productDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productName.trim()) {
      toast.error("Tên sản phẩm không được để trống!");
      return;
    }
    if (formData.price < 0) {
      toast.error("Giá phải lớn hơn hoặc bằng 0!");
      return;
    }

    if (formData.discountedPrice < 0) {
      toast.error("Giá đã giảm phải lớn hơn hoặc bằng 0!");
      return;
    }

    if (Number(formData.price) < Number(formData.discountedPrice)) {
      toast.error("Giá đã giảm phải nhỏ hơn giá gốc");
      return;
    }
    console.log("Updated product details:", formData);

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("ProductName", formData.productName);
    formDataToSend.append("Description", formData.description);
    formDataToSend.append("Price", formData.price);
    formDataToSend.append("IsHidden", formData.isHidden);
    formDataToSend.append("IsPopular", formData.isPopular);
    formDataToSend.append("CategoryId", formData.categoryId);
    formDataToSend.append("DiscountedPrice", formData.discountedPrice);
    formDataToSend.append("keywords", formData.keywords);
    formDataToSend.append("StockQuantity", formData.stockQuantity);

    // Nếu có ảnh, append thêm ảnh vào FormData (ví dụ: nếu bạn upload file hình ảnh)
    if (formData.imgURL) {
      formDataToSend.append("imgFile", formData.imgURL);
    }

    try {
      await updateProd(id, formDataToSend);
      toast.success("Cập Nhật Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin/products");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    }
  };

  return (
    <div className={clsx(styles["main-products"])}>
      <div>
        <Helmet>
          <title>{productDetails.$values[0].productName}</title>
          <meta
            name="description"
            content={productDetails.$values[0].description}
          />
          <meta name="keywords" content={productDetails.$values[0].keywords} />
          <meta
            property="og:title"
            content={productDetails.$values[0].productName}
          />
          <meta
            property="og:description"
            content={productDetails.$values[0].description}
          />
          <meta
            property="og:image"
            content={productDetails.$values[0].imgURL}
          />
        </Helmet>
      </div>
      <AdminSideBar
        site="products"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["product"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-product-light" : "list-product-dark"]
            )}
          >
            <div className={clsx(styles.container)}>
              <h1>Chỉnh Sửa Sản Phẩm</h1>
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-wrap justify-content-between"
              >
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="productName">Tên Sản Phẩm</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="keywords">Từ Khóa Tìm Kiếm</label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                  />
                </div>

                <div className={clsx(styles.formGroup, styles.formGroupCustom)}>
                  <label htmlFor="description">Mô Tả</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="price">Giá</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="discountedPrice">Giá Đã Giảm</label>
                  <input
                    type="number"
                    id="discountedPrice"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="categoryId">Danh mục</label>
                  <select
                    name="categoryId"
                    id="categoryId"
                    onChange={handleChange}
                    value={formData.categoryId}
                  >
                    {categoryList.$values.map((item, index) => (
                      <option key={index} value={item.categoryID}>
                        {item.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="imgURL">Ảnh</label>
                  <input
                    type="file"
                    id="imgURL"
                    name="imgURL"
                    className={clsx(styles["form-control"], "form-control")}
                    onChange={handleChange}
                  />
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="stockQuantity">Số Lượng</label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={clsx(styles.checkboxGroup)}>
                  <label>
                    <input
                      type="checkbox"
                      name="isHidden"
                      checked={formData.isHidden}
                      onChange={handleChange}
                    />
                    Bị Ẩn
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={formData.isPopular}
                      onChange={handleChange}
                    />
                    Phổ Biến
                  </label>
                </div>

                <button type="submit" className={clsx(styles.submitButton)}>
                  Lưu Thay Đổi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};

export const AddProduct = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [productDetails, setProductDetails] = useState({
    productName: "",
    keywords: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    categoryId: 1,
    imgURL: "",
    stockQuantity: 0,
    isHidden: false,
    isPopular: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState({
    $id: "",
    $values: [
      {
        $id: "",
        categoryID: 0,
        categoryName: "",
        imgURL: "",
        description: null,
        keywords: null,
      },
    ],
  });

  useEffect(() => {
    const fetchCateList = async () => {
      try {
        const data = await getCategoryList();
        console.log("Cate lisst: ", data);
        setCategoryList(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCateList();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setProductDetails({
      ...productDetails,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("productDetails: ", productDetails);
    if (!productDetails.productName.trim()) {
      toast.error("Tên sản phẩm không được để trống!");
      return;
    }
    if (productDetails.price < 0) {
      toast.error("Giá phải lớn hơn hoặc bằng 0!");
      return;
    }

    if (productDetails.discountedPrice < 0) {
      toast.error("Giá đã giảm phải lớn hơn hoặc bằng 0!");
      return;
    }

    if (Number(productDetails.price) < Number(productDetails.discountedPrice)) {
      toast.error("Giá đã giảm phải nhỏ hơn giá gốc");
      return;
    }
    console.log("Updated product details:", productDetails);

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("ProductName", productDetails.productName);
    formDataToSend.append("Description", productDetails.description);
    formDataToSend.append("Price", productDetails.price);
    formDataToSend.append("IsHidden", productDetails.isHidden);
    formDataToSend.append("IsPopular", productDetails.isPopular);
    formDataToSend.append("CategoryId", productDetails.categoryId);
    formDataToSend.append("DiscountedPrice", productDetails.discountedPrice);
    formDataToSend.append("keywords", productDetails.keywords);
    formDataToSend.append("StockQuantity", productDetails.stockQuantity);

    // Nếu có ảnh, append thêm ảnh vào FormData (ví dụ: nếu bạn upload file hình ảnh)
    if (productDetails.imgURL) {
      formDataToSend.append("imgFile", productDetails.imgURL);
    }

    try {
      await createProd(formDataToSend);
      toast.success("Thêm Mới Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin/products");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    }
  };

  return (
    <div className={clsx(styles["main-products"])}>
      <div>
        <Helmet>
          <title>Thêm Mới Sản Phẩm</title>
          <meta name="description" content="Thêm Mới Sản Phẩm Dành Cho Admin" />
          <meta
            name="keywords"
            content="sản phẩm, chỉnh sửa sản phẩm, thêm mới sản phẩm"
          />
          <meta property="og:title" content="Thêm Mới Sản Phẩm" />
          <meta property="og:description" content="Thêm Mới Sản Phẩm" />
          <meta property="og:image" content="/src/assets/Logo.png" />
        </Helmet>
      </div>
      <AdminSideBar
        site="products"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["product"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-product-light" : "list-product-dark"]
            )}
          >
            <div className={clsx(styles.container)}>
              <h1>Thêm Mới Sản Phẩm</h1>
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-wrap justify-content-between"
              >
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="productName">Tên Sản Phẩm</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={productDetails.productName}
                    onChange={handleChange}
                    placeholder="Tên Sản Phẩm"
                    required
                  />
                </div>
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="keywords">Từ Khóa Tìm Kiếm</label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={productDetails.keywords}
                    placeholder="Từ Khóa"
                    onChange={handleChange}
                  />
                </div>

                <div className={clsx(styles.formGroup, styles.formGroupCustom)}>
                  <label htmlFor="description">Mô Tả</label>
                  <textarea
                    id="description"
                    name="description"
                    value={productDetails.description}
                    onChange={handleChange}
                    placeholder="Mô Tả Sản Phẩm"
                  ></textarea>
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="price">Giá</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={productDetails.price}
                    onChange={handleChange}
                    placeholder="Giá Sản Phẩm"
                    required
                  />
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="discountedPrice">Giá Đã Giảm</label>
                  <input
                    type="number"
                    id="discountedPrice"
                    name="discountedPrice"
                    value={productDetails.discountedPrice}
                    onChange={handleChange}
                    placeholder="Giá Sản Phẩm Sau Giảm"
                    required
                  />
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="categoryId">Danh mục</label>
                  <select
                    name="categoryId"
                    id="categoryId"
                    onChange={handleChange}
                    value={productDetails.categoryId}
                  >
                    {categoryList.$values.map((item, index) => (
                      <option key={index} value={item.categoryID}>
                        {item.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="imgURL">Ảnh</label>
                  <input
                    type="file"
                    id="imgURL"
                    name="imgURL"
                    className={clsx(styles["form-control"], "form-control")}
                    onChange={handleChange}
                  />
                </div>

                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="stockQuantity">Số Lượng</label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={productDetails.stockQuantity}
                    onChange={handleChange}
                    placeholder="Số Lượng Sản Phẩm"
                    required
                  />
                </div>

                <div className={clsx(styles.checkboxGroup)}>
                  <label>
                    <input
                      type="checkbox"
                      name="isHidden"
                      checked={productDetails.isHidden}
                      onChange={handleChange}
                    />
                    Bị Ẩn
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={productDetails.isPopular}
                      onChange={handleChange}
                    />
                    Phổ Biến
                  </label>
                </div>

                <button type="submit" className={clsx(styles.submitButton)}>
                  Lưu Thay Đổi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};
export default AdminProduct;
