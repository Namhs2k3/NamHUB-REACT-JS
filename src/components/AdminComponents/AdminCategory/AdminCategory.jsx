import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminCategory.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import {
  createCate,
  getCategoryList,
  getCategoryListById,
  updateCate,
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

const AdminCategory = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [prodList, setProdList] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchProdListByName = async () => {
      setIsLoading(false);
      try {
        const data = await getCategoryList(searchTerm);
        console.log("Cate List: ", data);
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

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className={clsx(styles["main-categories"])}>
      <div>
        <Helmet>
          <title>Các Danh Mục Sản Phẩm</title>
          <meta name="description" content="Xem Các Danh Mục Sản Phẩm" />
          <meta
            name="keywords"
            content="danh mục, quản lý danh mục sản phẩm, danh sách, danh sách danh mục"
          />
          <meta property="og:title" content="Danh Sách Các Danh Mục Sản Phẩm" />
          <meta
            property="og:description"
            content="Xem Danh Sách Các Danh Mục Sản Phẩm"
          />
          <meta property="og:image" content="/src/assets/Logo.png" />
        </Helmet>
      </div>
      <AdminSideBar
        site="categories"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["category"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-cate-light" : "list-cate-dark"]
            )}
          >
            <div className={clsx(styles["title"])}>CÁC DANH MỤC SẢN PHẨM</div>
            <div className="d-flex justify-content-between align-items-center">
              <Link
                to="/admin/categories/add-category"
                className="btn btn-success text-white mb-3"
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Thêm Danh Mục
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
                          alt={item.categoryName || "Default Image"}
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
                        {item.categoryName}
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
                          to={`/admin/categories/edit-category/${generateSlug(item.categoryName)}/${item.categoryID}`}
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

export const EditCategory = () => {
  const { id } = useParams();

  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [productDetails, setProductDetails] = useState({
    $id: "1",
    $values: [
      {
        $id: "2",
        categoryID: 0,
        categoryName: "",
        imgURL: "",
        description: null,
        keywords: null,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getCategoryListById(Number(id));
        console.log("cate details: ", data);
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setProductDetails((prevDetails) => ({
      ...prevDetails, // Sao chép toàn bộ đối tượng
      $values: prevDetails.$values.map((item, index) => {
        if (index === 0) {
          // Giả sử bạn chỉ muốn cập nhật phần tử đầu tiên
          return {
            ...item, // Sao chép phần tử cũ
            [name]:
              type === "checkbox"
                ? checked
                : type === "file"
                  ? files[0]
                  : value,
          };
        }
        return item; // Giữ nguyên các phần tử khác
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productDetails.$values[0].categoryName.trim()) {
      toast.error("Tên danh mục không được để trống!");
      return;
    }

    console.log("Updated cate details:", productDetails);

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append(
      "CategoryName",
      productDetails.$values[0].categoryName
    );
    formDataToSend.append(
      "CategoryDescription",
      productDetails.$values[0].description || ""
    );
    formDataToSend.append("keywords", productDetails.$values[0].keywords || "");

    // Nếu có ảnh, append thêm ảnh vào FormData (ví dụ: nếu bạn upload file hình ảnh)
    if (productDetails.$values[0].imgURL) {
      formDataToSend.append("imgFile", productDetails.$values[0].imgURL);
    }

    try {
      setIsLoading(true);
      await updateCate(id, formDataToSend);
      toast.success("Cập Nhật Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin/categories");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(styles["main-categories"])}>
      <div>
        <Helmet>
          <title>{productDetails.$values[0].categoryName}</title>
          <meta
            name="description"
            content={productDetails.$values[0].description}
          />
          <meta name="keywords" content={productDetails.$values[0].keywords} />
          <meta
            property="og:title"
            content={productDetails.$values[0].categoryName}
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
        site="categories"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["category"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-cate-light" : "list-cate-dark"]
            )}
          >
            <div className={clsx(styles.container)}>
              <h1>Chỉnh Sửa Danh Mục</h1>
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-wrap justify-content-between"
              >
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="categoryName">Tên Danh Mục</label>
                  <input
                    type="text"
                    id="categoryName"
                    name="categoryName"
                    value={productDetails.$values[0].categoryName}
                    onChange={handleChange}
                    placeholder="Tên Danh Mục"
                    required
                  />
                </div>
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="keywords">Từ Khóa Tìm Kiếm</label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={productDetails.$values[0].keywords}
                    onChange={handleChange}
                    placeholder="Từ Khóa"
                  />
                </div>

                <div className={clsx(styles.formGroup, styles.formGroupCustom)}>
                  <label htmlFor="description">Mô Tả</label>
                  <textarea
                    id="description"
                    name="description"
                    value={productDetails.$values[0].description}
                    onChange={handleChange}
                    placeholder="Mô Tả"
                  ></textarea>
                </div>

                <div className={clsx(styles.customFormGroup)}>
                  <label htmlFor="imgURL">Ảnh</label>
                  <input
                    type="file"
                    id="imgURL"
                    name="imgURL"
                    className={clsx(styles["form-control"], "form-control")}
                    onChange={handleChange}
                  />
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

export const AddCategory = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [productDetails, setProductDetails] = useState({
    categoryName: "",
    keywords: "",
    description: "",
    imgURL: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    console.log("categoryDetails: ", productDetails);
    if (!productDetails.categoryName.trim()) {
      toast.error("Tên danh mục không được để trống!");
      return;
    }
    console.log("Updated category details:", productDetails);

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("CategoryName", productDetails.categoryName);
    formDataToSend.append("CategoryDescription", productDetails.description);
    formDataToSend.append("keywords", productDetails.keywords);
    // Nếu có ảnh, append thêm ảnh vào FormData (ví dụ: nếu bạn upload file hình ảnh)
    if (productDetails.imgURL) {
      formDataToSend.append("imgFile", productDetails.imgURL);
    }

    try {
      setIsLoading(true);
      await createCate(formDataToSend);
      toast.success("Thêm Mới Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin/categories");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(styles["main-categories"])}>
      <div>
        <Helmet>
          <title>Thêm Mới Danh Mục</title>
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
        site="categories"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["category"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-cate-light" : "list-cate-dark"]
            )}
          >
            <div className={clsx(styles.container)}>
              <h1>Thêm Mới Danh Mục</h1>
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-wrap justify-content-between"
              >
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="categoryName">Tên Danh Mục</label>
                  <input
                    type="text"
                    id="categoryName"
                    name="categoryName"
                    value={productDetails.CategoryName}
                    onChange={handleChange}
                    placeholder="Tên Danh Mục"
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

                <div className={clsx(styles.customFormGroup)}>
                  <label htmlFor="imgURL">Ảnh</label>
                  <input
                    type="file"
                    id="imgURL"
                    name="imgURL"
                    className={clsx(styles["form-control"], "form-control")}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className={clsx(styles.submitButton)}>
                  Tạo Danh Mục Mới
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
export default AdminCategory;
