import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminBanner.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import {
  addBanner,
  getBannerById,
  getBannerList,
  updateBanner,
} from "../../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import { Unauthorized } from "../../Unauthorized/Unauth";

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

const AdminBanner = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isPermitted, setPermitted] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [prodList, setProdList] = useState();

  useEffect(() => {
    const fetchProdListByName = async () => {
      setIsLoading(false);
      try {
        const data = await getBannerList();
        console.log("Banner List: ", data);
        setProdList(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/login");
        } else if (err.status === 403) {
          setPermitted(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdListByName();
  }, [navigate]);

  return (
    <div className={clsx(styles["main-banners"])}>
      <Helmet>
        <title>BANNER QUẢNG CÁO</title>
        <meta name="description" content="Xem Các Banner Quảng Cáo" />
        <meta name="keywords" content="quảng cáo, banner" />
        <meta property="og:title" content="Danh Sách Các Banner Quảng Cáo" />
        <meta
          property="og:description"
          content="Xem Danh Sách Các Banner Quảng Cáo"
        />
        <meta property="og:image" content="/src/assets/Logo.png" />
      </Helmet>
      <AdminSideBar
        site="banners"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["banner"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          {isPermitted ? (
            <div
              className={clsx(
                styles[isChecked ? "list-banner-light" : "list-banner-dark"]
              )}
            >
              <div className={clsx(styles["title"])}>BANNER QUẢNG CÁO</div>
              <div className="d-flex justify-content-between align-items-center">
                <Link
                  to="/admin/banners/add-banner"
                  className="btn btn-success text-white mb-3"
                >
                  <FontAwesomeIcon icon={faCirclePlus} /> Thêm Banner
                </Link>
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
                        Tiêu Đề
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
                        Thứ Tự
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
                        Liên Kết
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
                        Kích Hoạt
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
                        Bắt Đầu Lúc
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
                        Kết Thúc Lúc
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
                      <tr key={item.bannerId}>
                        <th style={{ verticalAlign: "middle" }} scope="row">
                          {index + 1}
                        </th>
                        <td
                          style={{
                            verticalAlign: "middle",
                            maxWidth: "200px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <img
                            src={item.imgUrl || "../../../assets/Logo.png"}
                            alt={item.title || "Default Image"}
                            className={clsx(styles["img"])}
                            style={{
                              width: "auto",
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
                          {item.title}
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
                          {item.displayOrder || 0}
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
                          {item.link || "Không có liên kết đến"}
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
                          <span
                            className={clsx(
                              styles["badge"],
                              styles[
                                item.isActive
                                  ? "badge-success"
                                  : "badge-secondary"
                              ]
                            )}
                          >
                            {item.isActive ? "Có" : "Không"}
                          </span>
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
                          {format(item.startDate, "MM/dd/yyyy HH:mm:ss") ||
                            "Không biết"}
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
                          {format(item.endDate, "MM/dd/yyyy HH:mm:ss") ||
                            "Không biết"}
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
                            to={`/admin/banners/edit-banner/${generateSlug(item.title)}/${item.bannerId}`}
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
          ) : (
            <Unauthorized />
          )}
        </div>
      </div>
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};

export const EditBanner = () => {
  const { id } = useParams();

  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [productDetails, setProductDetails] = useState({
    $id: "1",
    $values: [
      {
        $id: "2",
        bannerId: 0,
        title: "",
        imgUrl: "",
        link: null,
        displayOrder: null,
        isActive: false,
        startDate: new Date(),
        endDate: new Date(),
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isPermitted, setPermitted] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getBannerById(Number(id));
        console.log("banner details: ", data);
        setProductDetails(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/login");
        } else if (err.status === 403) {
          setPermitted(false);
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

  const handleDateChange = (date, name) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      $values: prevDetails.$values.map((item, index) =>
        index === 0 ? { ...item, [name]: date } : item
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productDetails.$values[0].title.trim()) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }

    console.log("Updated banner details:", productDetails);

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("Title", productDetails.$values[0].title);
    formDataToSend.append("Link", productDetails.$values[0].link || "");
    formDataToSend.append(
      "DisplayOrder",
      productDetails.$values[0].displayOrder || 0
    );
    formDataToSend.append(
      "IsActive",
      productDetails.$values[0].isActive || false
    );
    formDataToSend.append(
      "StartDate",
      format(productDetails.$values[0].startDate, "MM/dd/yyyy HH:mm:ss") ||
        format(new Date(), "MM/dd/yyyy HH:mm:ss")
    );
    formDataToSend.append(
      "EndDate",
      format(productDetails.$values[0].endDate, "MM/dd/yyyy HH:mm:ss") ||
        format(new Date(), "MM/dd/yyyy HH:mm:ss")
    );

    // Nếu có ảnh, append thêm ảnh vào FormData (ví dụ: nếu bạn upload file hình ảnh)
    if (productDetails.$values[0].imgUrl) {
      formDataToSend.append("imgFile", productDetails.$values[0].imgUrl);
    }

    try {
      setIsLoading(true);
      await updateBanner(id, formDataToSend);
      toast.success("Cập Nhật Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin/banners");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(styles["main-banners"])}>
      <div>
        <Helmet>
          <title>{productDetails.$values[0].title}</title>
          <meta name="description" content="chỉnh sửa banner cho admin" />
          <meta name="keywords" content="banner, chỉnh sửa banner" />
          <meta property="og:title" content={productDetails.$values[0].title} />
          <meta
            property="og:description"
            content="chỉnh sửa banner cho admin"
          />
          <meta
            property="og:image"
            content={productDetails.$values[0].imgUrl}
          />
        </Helmet>
      </div>
      <AdminSideBar
        site="banners"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["banner"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          {isPermitted ? (
            <div
              className={clsx(
                styles[isChecked ? "list-cate-light" : "list-cate-dark"]
              )}
            >
              <div className={clsx(styles.container)}>
                <h1>Chỉnh Sửa Banner Quảng Cáo</h1>
                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-wrap justify-content-between"
                >
                  <div className={clsx(styles.formGroup)}>
                    <label htmlFor="title">Tiêu Đề Quảng Cáo</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={productDetails.$values[0].title}
                      onChange={handleChange}
                      placeholder="Tiêu Đề"
                      required
                    />
                  </div>
                  <div className={clsx(styles.formGroup)}>
                    <label htmlFor="link">Liên Kết Đến</label>
                    <input
                      type="text"
                      id="link"
                      name="link"
                      value={productDetails.$values[0].link}
                      onChange={handleChange}
                      placeholder="Liên Kết Đến Trang Nào?"
                    />
                  </div>

                  <div
                    className={clsx(styles.formGroup, styles.formGroupCustom)}
                  >
                    <label htmlFor="displayOrder">Thứ Tự Xuất Hiện</label>
                    <input
                      type="number"
                      id="displayOrder"
                      name="displayOrder"
                      value={productDetails.$values[0].displayOrder}
                      onChange={handleChange}
                      placeholder="Thứ tự xuất hiện"
                    ></input>
                  </div>
                  <div className={clsx(styles.formGroupCustom)}>
                    <label htmlFor="imgUrl">Ảnh</label>
                    <input
                      type="file"
                      id="imgUrl"
                      name="imgUrl"
                      className={clsx(styles["form-control"], "form-control")}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex gap-3 mb-3 justify-content-between w-100">
                    <div className="d-flex justify-content-start w-50">
                      <div>
                        <label htmlFor="start" className="d-flex flex-column">
                          <p className="mb-0 text-start w-100">Bắt Đầu Lúc</p>
                          <DatePicker
                            id="start"
                            selected={
                              new Date(productDetails.$values[0].startDate)
                            }
                            onChange={(date) =>
                              handleDateChange(date, "startDate")
                            }
                            dateFormat="MM/dd/yyyy HH:mm:ss"
                            showDateSelect
                            showTimeSelect
                            placeholderText="Select Start Date"
                            className={clsx(styles["date"])}
                            customInput={
                              <div
                                className={clsx(
                                  styles["date-picker__input-container"]
                                )}
                              >
                                <input
                                  className={clsx(styles["date"])}
                                  value={format(
                                    productDetails.$values[0].startDate,
                                    "MM/dd/yyyy HH:mm:ss"
                                  )}
                                />
                                <span
                                  className={clsx(
                                    styles["date-picker__input-icon"]
                                  )}
                                >
                                  📅
                                </span>
                              </div>
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="d-flex justify-content-start w-50">
                      <div>
                        <label htmlFor="" className="d-flex flex-column">
                          <p className="mb-0 text-start w-100">Kết Thúc Lúc</p>
                          <DatePicker
                            selected={
                              new Date(productDetails.$values[0].endDate)
                            }
                            onChange={(date) =>
                              handleDateChange(date, "endDate")
                            }
                            dateFormat="MM/dd/yyyy HH:mm:ss"
                            showDateSelect
                            showTimeSelect
                            placeholderText="Select End Date"
                            className={clsx(styles["date"])}
                            customInput={
                              <div
                                className={clsx(
                                  styles["date-picker__input-container"]
                                )}
                              >
                                <input
                                  className={clsx(styles["date"])}
                                  value={format(
                                    productDetails.$values[0].endDate,
                                    "MM/dd/yyyy HH:mm:ss"
                                  )}
                                />
                                <span
                                  className={clsx(
                                    styles["date-picker__input-icon"]
                                  )}
                                >
                                  📅
                                </span>
                              </div>
                            }
                          />
                        </label>
                      </div>
                    </div>
                    <div className={clsx(styles.customCheckbox)}>
                      <label htmlFor="isActive">
                        <input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={productDetails.$values[0].isActive}
                          onChange={handleChange}
                          placeholder="Active"
                        ></input>
                        Active
                      </label>
                    </div>
                  </div>

                  <button type="submit" className={clsx(styles.submitButton)}>
                    Lưu Thay Đổi
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Unauthorized />
          )}
        </div>
      </div>
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};

export const AddBanner = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [productDetails, setProductDetails] = useState({
    title: "",
    imgUrl: "",
    link: null,
    displayOrder: null,
    isActive: false,
    startDate: new Date(),
    endDate: new Date(),
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

  const handleDateChange = (date, name) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails, // Sao chép toàn bộ các giá trị trước đó
      [name]: date, // Cập nhật giá trị mới với tên thuộc tính động
    }));
  };

  console.log("banners add: ", productDetails);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productDetails.title.trim()) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }

    if (productDetails.displayOrder <= 0) {
      toast.error("Thứ tự xuất hiện không hợp lệ!");
      return;
    }

    console.log("Add banner details:", productDetails);

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("Title", productDetails.title);
    formDataToSend.append("Link", productDetails.link || "");
    formDataToSend.append("DisplayOrder", productDetails.displayOrder || 0);
    formDataToSend.append("IsActive", productDetails.isActive || false);
    formDataToSend.append(
      "StartDate",
      format(productDetails.startDate, "MM/dd/yyyy HH:mm:ss") ||
        format(new Date(), "MM/dd/yyyy HH:mm:ss")
    );
    formDataToSend.append(
      "EndDate",
      format(productDetails.endDate, "MM/dd/yyyy HH:mm:ss") ||
        format(new Date(), "MM/dd/yyyy HH:mm:ss")
    );

    // Nếu có ảnh, append thêm ảnh vào FormData (ví dụ: nếu bạn upload file hình ảnh)
    if (productDetails.imgUrl) {
      formDataToSend.append("imgFile", productDetails.imgUrl);
    }

    try {
      setIsLoading(true);
      await addBanner(formDataToSend);
      toast.success("Thêm Mới Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin/banners");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(styles["main-banners"])}>
      <div>
        <Helmet>
          <title>Thêm Mới Banner QC</title>
          <meta name="description" content="Thêm Mới Banner" />
          <meta name="keywords" content="banner" />
          <meta property="og:title" content="Thêm Mới Banner" />
          <meta property="og:description" content="Thêm Mới Banner" />
          <meta property="og:image" content="/src/assets/Logo.png" />
        </Helmet>
      </div>
      <AdminSideBar
        site="banners"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["banner"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-banner-light" : "list-banner-dark"]
            )}
          >
            <div className={clsx(styles.container)}>
              <h1>Thêm Mới Banner</h1>
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-wrap justify-content-between"
              >
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="title">Tiêu Đề Quảng Cáo</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={productDetails.title}
                    onChange={handleChange}
                    placeholder="Tiêu Đề"
                    required
                  />
                </div>
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="link">Liên Kết Đến</label>
                  <input
                    type="text"
                    id="link"
                    name="link"
                    value={productDetails.link}
                    onChange={handleChange}
                    placeholder="Liên Kết Đến Trang Nào?"
                  />
                </div>

                <div className={clsx(styles.formGroup, styles.formGroupCustom)}>
                  <label htmlFor="displayOrder">Thứ Tự Xuất Hiện</label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={productDetails.displayOrder}
                    onChange={handleChange}
                    placeholder="Thứ tự xuất hiện"
                  ></input>
                </div>
                <div className={clsx(styles.formGroupCustom)}>
                  <label htmlFor="imgUrl">Ảnh</label>
                  <input
                    type="file"
                    id="imgUrl"
                    name="imgUrl"
                    className={clsx(styles["form-control"], "form-control")}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex gap-3 mb-3 justify-content-between w-100">
                  <div className="d-flex justify-content-start w-50">
                    <div>
                      <label htmlFor="start" className="d-flex flex-column">
                        <p className="mb-0 text-start w-100">Bắt Đầu Lúc</p>
                        <DatePicker
                          id="start"
                          selected={new Date(productDetails.startDate)}
                          onChange={(date) =>
                            handleDateChange(date, "startDate")
                          }
                          dateFormat="MM/dd/yyyy HH:mm:ss"
                          showDateSelect
                          showTimeSelect
                          placeholderText="Select Start Date"
                          className={clsx(styles["date"])}
                          customInput={
                            <div
                              className={clsx(
                                styles["date-picker__input-container"]
                              )}
                            >
                              <input
                                className={clsx(styles["date"])}
                                value={format(
                                  productDetails.startDate,
                                  "MM/dd/yyyy HH:mm:ss"
                                )}
                              />
                              <span
                                className={clsx(
                                  styles["date-picker__input-icon"]
                                )}
                              >
                                📅
                              </span>
                            </div>
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-start w-50">
                    <div>
                      <label htmlFor="" className="d-flex flex-column">
                        <p className="mb-0 text-start w-100">Kết Thúc Lúc</p>
                        <DatePicker
                          selected={new Date(productDetails.endDate)}
                          onChange={(date) => handleDateChange(date, "endDate")}
                          dateFormat="MM/dd/yyyy HH:mm:ss"
                          showDateSelect
                          showTimeSelect
                          placeholderText="Select End Date"
                          className={clsx(styles["date"])}
                          customInput={
                            <div
                              className={clsx(
                                styles["date-picker__input-container"]
                              )}
                            >
                              <input
                                className={clsx(styles["date"])}
                                value={format(
                                  productDetails.endDate,
                                  "MM/dd/yyyy HH:mm:ss"
                                )}
                              />
                              <span
                                className={clsx(
                                  styles["date-picker__input-icon"]
                                )}
                              >
                                📅
                              </span>
                            </div>
                          }
                        />
                      </label>
                    </div>
                  </div>
                  <div className={clsx(styles.customCheckbox)}>
                    <label htmlFor="isActive">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={productDetails.isActive}
                        onChange={handleChange}
                        placeholder="Active"
                      ></input>
                      Active
                    </label>
                  </div>
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
export default AdminBanner;
