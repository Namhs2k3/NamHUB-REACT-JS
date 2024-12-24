import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminDiscount.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import {
  addDiscount,
  getDiscountById,
  getDiscountList,
  updateDiscount,
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

const AdminDiscount = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [prodList, setProdList] = useState();
  const [isPermitted, setPermitted] = useState(true);

  useEffect(() => {
    const fetchProdListByName = async () => {
      setIsLoading(false);
      try {
        const data = await getDiscountList();
        console.log("Discount List: ", data);
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
    <div className={clsx(styles["main-discounts"])}>
      <Helmet>
        <title>MÃ GIẢM GIÁ</title>
        <meta name="description" content="Xem Các MÃ GIẢM GIÁ" />
        <meta name="keywords" content="quảng cáo, banner" />
        <meta property="og:title" content="Danh Sách Các Banner Quảng Cáo" />
        <meta
          property="og:description"
          content="Xem Danh Sách Các Banner Quảng Cáo"
        />
        <meta property="og:image" content="/src/assets/Logo.png" />
      </Helmet>
      <AdminSideBar
        site="discounts"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["discount"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          {isPermitted ? (
            <div
              className={clsx(
                styles[isChecked ? "list-discount-light" : "list-discount-dark"]
              )}
            >
              <div className={clsx(styles["title"])}>MÃ GIẢM GIÁ</div>
              <div className="d-flex justify-content-between align-items-center">
                <Link
                  to="/admin/discounts/add-discount"
                  className="btn btn-success text-white mb-3"
                >
                  <FontAwesomeIcon icon={faCirclePlus} /> Thêm Mã Giảm Giá
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
                        Mã Giảm Giá
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
                        Loại
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
                        Giá Trị
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
                        ĐH Từ
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
                        Có Hạn Từ
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
                        Cho Đến Hết
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
                        SL SD Tối Đa
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
                        Đã Dùng
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
                        1Lần/1KH
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
                        Trạng Thái
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
                          {item.code}
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
                          {item.discountType === "amount" ? "VND" : "(%)"}
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
                          {new Intl.NumberFormat("vi-VN").format(
                            item.discountValue
                          )}
                          {item.discountType === "amount" ? "đ" : "%"}
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
                          {new Intl.NumberFormat("vi-VN").format(
                            item.minOrderValue
                          )}
                          đ
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
                            maxWidth: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN").format(
                            item.maxUsageCount
                          )}
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
                          {new Intl.NumberFormat("vi-VN").format(
                            item.currentUsageCount
                          )}
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
                                item.isSingleUse
                                  ? "badge-success"
                                  : "badge-secondary"
                              ]
                            )}
                          >
                            {item.isSingleUse ? "True" : "False"}
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
                          <span
                            className={clsx(
                              styles["badge"],
                              styles[
                                item.isActive ? "badge-success" : "badge-danger"
                              ]
                            )}
                          >
                            {item.isActive ? "Active" : "Inactive"}
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
                          <Link
                            to={`/admin/discounts/edit-discount/${generateSlug(item.code)}/${item.discountId}`}
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

export const EditDiscount = () => {
  const { id } = useParams();

  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [productDetails, setProductDetails] = useState({
    $id: "1",
    $values: [
      {
        code: "string",
        discountValue: 100,
        discountType: "amount",
        minOrderValue: 0,
        startDate: "2024-09-19T11:46:04.597",
        endDate: "2024-09-20T11:46:04.597",
        maxUsageCount: 2147483647,
        currentUsageCount: 116,
        isSingleUse: false,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isPermitted, setPermitted] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getDiscountById(Number(id));
        console.log("Discount details: ", data);
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
    if (!productDetails.$values[0].code.trim()) {
      toast.error("Mã giảm giá không được để trống!");
      return;
    }
    if (productDetails.$values[0].discountType === "percent") {
      if (
        productDetails.$values[0].discountValue > 100 ||
        productDetails.$values[0].discountValue <= 0
      ) {
        toast.error("Giá Trị Không Hợp Lệ!");
        return;
      }
    }

    if (
      productDetails.$values[0].maxUsageCount > 2147483647 ||
      productDetails.$values[0].maxUsageCount <= 0
    ) {
      toast.error(
        'Giá Trị Của "Lượt Sử Dụng Tối Đa" Không Hợp Lệ Hoặc Quá Lớn!'
      );
      return;
    }

    if (
      productDetails.$values[0].minOrderValue >= 100000000 ||
      productDetails.$values[0].minOrderValue < 0
    ) {
      toast.error(
        'Giá Trị Của "Đơn Hàng Tối Thiểu" Không Hợp Lệ Hoặc Quá Lớn!'
      );
      return;
    }

    if (
      productDetails.$values[0].discountValue >= 100000000 ||
      productDetails.$values[0].discountValue < 0
    ) {
      toast.error("Giá Trị Của Không Hợp Lệ Hoặc Quá Lớn!");
      return;
    }

    if (
      productDetails.$values[0].startDate > productDetails.$values[0].endDate
    ) {
      toast.error("ngày bắt đầu ko được vượt quá ngày kết thúc");
      return;
    }

    console.log("Updated Discount details:", productDetails);

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("Code", productDetails.$values[0].code);
    formDataToSend.append(
      "DiscountType",
      productDetails.$values[0].discountType || ""
    );
    formDataToSend.append(
      "DiscountValue",
      productDetails.$values[0].discountValue || 0
    );
    formDataToSend.append(
      "MinimumOrderAmount",
      productDetails.$values[0].minOrderValue || 0
    );
    formDataToSend.append(
      "MaxUsageCount",
      productDetails.$values[0].maxUsageCount || 0
    );
    formDataToSend.append(
      "IsSingleUse",
      productDetails.$values[0].isSingleUse || false
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

    try {
      setIsLoading(true);
      await updateDiscount(id, formDataToSend);
      toast.success("Cập Nhật Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin/discounts");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(styles["main-discounts"])}>
      <div>
        <Helmet>
          <title>Cập Nhật Mã Giảm Giá {productDetails.$values[0].code}</title>
          <meta name="description" content="chỉnh sửa banner cho admin" />
          <meta name="keywords" content="banner, chỉnh sửa banner" />
          <meta property="og:title" content={productDetails.$values[0].code} />
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
        site="discounts"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["discount"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          {isPermitted ? (
            <div
              className={clsx(
                styles[isChecked ? "list-discount-light" : "list-discount-dark"]
              )}
            >
              <div className={clsx(styles.container)}>
                <h1>Cập Nhật Mã Giảm Giá</h1>
                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-wrap justify-content-between"
                >
                  <div className={clsx(styles.formGroup)}>
                    <label htmlFor="code">Mã Giảm Giá</label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={productDetails.$values[0].code}
                      onChange={handleChange}
                      placeholder="Mã"
                      disabled
                    />
                  </div>
                  <div className={clsx(styles.formGroup)}>
                    <label htmlFor="link">Giảm Theo</label>
                    <select
                      name="discountType"
                      id=""
                      onChange={handleChange}
                      value={productDetails.$values[0].discountType}
                    >
                      <option value="amount">VND</option>
                      <option value="percent">Phần Trăm (%)</option>
                    </select>
                  </div>

                  <div className={clsx(styles.formGroup, styles.formGroup3)}>
                    <label htmlFor="discountValue">Giá Trị</label>
                    <input
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      value={productDetails.$values[0].discountValue}
                      onChange={handleChange}
                      placeholder="Giá Trị"
                    ></input>
                  </div>
                  <div className={clsx(styles.formGroup, styles.formGroup3)}>
                    <label htmlFor="minOrderValue">Đơn Hàng Tối Thiểu Từ</label>
                    <input
                      type="number"
                      id="minOrderValue"
                      name="minOrderValue"
                      value={productDetails.$values[0].minOrderValue}
                      onChange={handleChange}
                      placeholder="Giá Trị"
                    ></input>
                  </div>
                  <div className={clsx(styles.formGroup, styles.formGroup3)}>
                    <label htmlFor="maxUsageCount">Lượt Sử Dụng Tối Đa</label>
                    <input
                      type="number"
                      id="maxUsageCount"
                      name="maxUsageCount"
                      value={productDetails.$values[0].maxUsageCount}
                      onChange={handleChange}
                      placeholder="Giá Trị"
                    ></input>
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
                    <div className={clsx(styles.customCheckbox, "flex-wrap")}>
                      <div className="w-50">
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
                      <div className="w-100">
                        <label htmlFor="isSingleUse">
                          <input
                            type="checkbox"
                            id="isSingleUse"
                            name="isSingleUse"
                            checked={productDetails.$values[0].isSingleUse}
                            onChange={handleChange}
                            placeholder="isSingleUse"
                          ></input>
                          1Lần/1KH
                        </label>
                      </div>
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

export const AddDiscount = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [productDetails, setProductDetails] = useState({
    code: "",
    discountValue: 0,
    discountType: "amount",
    minOrderValue: 0,
    startDate: new Date(),
    endDate: new Date(),
    maxUsageCount: 2147483647,
    currentUsageCount: 0,
    isSingleUse: false,
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

  console.log("Discounts add: ", productDetails);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productDetails.code.trim()) {
      toast.error("Mã giảm giá không được để trống!");
      return;
    }

    if (productDetails.discountType === "percent") {
      if (
        productDetails.discountValue > 100 ||
        productDetails.discountValue <= 0
      ) {
        toast.error("Giá Trị Không Hợp Lệ!");
        return;
      }
    }

    if (
      productDetails.maxUsageCount > 2147483647 ||
      productDetails.maxUsageCount <= 0
    ) {
      toast.error(
        'Giá Trị Của "Lượt Sử Dụng Tối Đa" Không Hợp Lệ Hoặc Quá Lớn!'
      );
      return;
    }

    if (
      productDetails.minOrderValue >= 100000000 ||
      productDetails.minOrderValue < 0
    ) {
      toast.error(
        'Giá Trị Của "Đơn Hàng Tối Thiểu" Không Hợp Lệ Hoặc Quá Lớn!'
      );
      return;
    }

    if (
      productDetails.discountValue >= 100000000 ||
      productDetails.discountValue <= 0
    ) {
      toast.error("Giá Trị Của Không Hợp Lệ Hoặc Quá Lớn!");
      return;
    }

    if (productDetails.startDate > productDetails.endDate) {
      toast.error("ngày bắt đầu ko được vượt quá ngày kết thúc");
      return;
    }

    console.log("Updated Discount details:", productDetails);

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("Code", productDetails.code);
    formDataToSend.append("DiscountType", productDetails.discountType || "");
    formDataToSend.append("DiscountValue", productDetails.discountValue || 0);
    formDataToSend.append(
      "MinimumOrderAmount",
      productDetails.minOrderValue || 0
    );
    formDataToSend.append("MaxUsageCount", productDetails.maxUsageCount || 0);
    formDataToSend.append("IsSingleUse", productDetails.isSingleUse || false);
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

    try {
      setIsLoading(true);
      await addDiscount(formDataToSend);
      toast.success("Thêm Mới Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin/discounts");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(styles["main-discounts"])}>
      <div>
        <Helmet>
          <title>Thêm Mới Mã Giảm Giá</title>
          <meta name="description" content="Thêm Mới Banner" />
          <meta name="keywords" content="banner" />
          <meta property="og:title" content="Thêm Mới Banner" />
          <meta property="og:description" content="Thêm Mới Banner" />
          <meta property="og:image" content="/src/assets/Logo.png" />
        </Helmet>
      </div>
      <AdminSideBar
        site="discounts"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["discount"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-discount-light" : "list-discount-dark"]
            )}
          >
            <div className={clsx(styles.container)}>
              <h1>Thêm Mới Mã Giảm Giá</h1>
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-wrap justify-content-between"
              >
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="code">Mã Giảm Giá</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={productDetails.code}
                    onChange={handleChange}
                    placeholder="Mã"
                    required
                  />
                </div>
                <div className={clsx(styles.formGroup)}>
                  <label htmlFor="discountType">Giảm Theo</label>
                  <select
                    name="discountType"
                    id="discountType"
                    onChange={handleChange}
                    value={productDetails.discountType}
                  >
                    <option value="amount">VND</option>
                    <option value="percent">Phần Trăm (%)</option>
                  </select>
                </div>

                <div className={clsx(styles.formGroup, styles.formGroup3)}>
                  <label htmlFor="discountValue">Giá Trị</label>
                  <input
                    type="number"
                    id="discountValue"
                    name="discountValue"
                    value={productDetails.discountValue}
                    onChange={handleChange}
                    placeholder="Giá Trị"
                  ></input>
                </div>
                <div className={clsx(styles.formGroup, styles.formGroup3)}>
                  <label htmlFor="minOrderValue">Đơn Hàng Tối Thiểu Từ</label>
                  <input
                    type="number"
                    id="minOrderValue"
                    name="minOrderValue"
                    value={productDetails.minOrderValue}
                    onChange={handleChange}
                    placeholder="Giá Trị"
                  ></input>
                </div>
                <div className={clsx(styles.formGroup, styles.formGroup3)}>
                  <label htmlFor="maxUsageCount">Lượt Sử Dụng Tối Đa</label>
                  <input
                    type="number"
                    id="maxUsageCount"
                    name="maxUsageCount"
                    value={productDetails.maxUsageCount}
                    onChange={handleChange}
                    placeholder="Giá Trị"
                  ></input>
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
                  <div className={clsx(styles.customCheckbox, "flex-wrap")}>
                    <div className="w-50">
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
                    <div className="w-100">
                      <label htmlFor="isSingleUse">
                        <input
                          type="checkbox"
                          id="isSingleUse"
                          name="isSingleUse"
                          checked={productDetails.isSingleUse}
                          onChange={handleChange}
                          placeholder="isSingleUse"
                        ></input>
                        1Lần/1KH
                      </label>
                    </div>
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
export default AdminDiscount;
