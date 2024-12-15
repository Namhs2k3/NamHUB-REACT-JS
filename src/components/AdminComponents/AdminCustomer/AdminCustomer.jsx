import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminCustomer.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import {
  getCustomerList,
  getCustomerOrderItems,
  getCustomerOrderList,
} from "../../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

const AdminCustomer = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoading, setIsLoading] = useState(false);
  const [prodList, setProdList] = useState();

  useEffect(() => {
    const fetchProdListByName = async () => {
      setIsLoading(false);
      try {
        const data = await getCustomerList();
        console.log("Customer List: ", data);
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
  }, [navigate]);

  return (
    <div className={clsx(styles["main-banners"])}>
      <Helmet>
        <title>Danh Sách Khách Hàng</title>
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
        site="customers"
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
            <div className={clsx(styles["title"])}>Danh Sách Khách Hàng</div>
            <div className="d-flex justify-content-between align-items-center"></div>
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
                      SĐT
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
                      email
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
                      Địa Chỉ
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
                      Tạo Lúc
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
                      Cập Nhật Lúc
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
                          src={
                            `${baseUrl}${item.userImage}` ||
                            "../../../assets/Logo.png"
                          }
                          alt={item.fullName || "Default Image"}
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
                        {item.fullName}
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
                        {item.phone || "Không có"}
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
                        {item.email || "Không có"}
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
                        {item.customerAddress || "Không có"}
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
                        {format(item.createdAt, "MM/dd/yyyy HH:mm:ss") ||
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
                        {format(item.updatedAt, "MM/dd/yyyy HH:mm:ss") ||
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
                          to={`/admin/customers/customer-orders/${item.customerId}`}
                          className="btn btn-warning btn-sm"
                        >
                          <FontAwesomeIcon icon={faList} /> Xem Orders
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

export const AdminCustomerOrders = () => {
  const { id } = useParams();
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [prodList, setProdList] = useState();

  useEffect(() => {
    const fetchProdListByName = async () => {
      setIsLoading(false);
      try {
        const data = await getCustomerOrderList(id);
        console.log("Customer Order List: ", data);
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
  }, [navigate, id]);

  return (
    <div className={clsx(styles["main-banners"])}>
      <Helmet>
        <title>Danh Sách Đơn hàng</title>
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
        site="customers"
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
            <div className={clsx(styles["title"])}>Danh Sách Đơn Hàng</div>
            <div className="d-flex justify-content-between align-items-center"></div>
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
                      Tổng Tiền
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
                      Trạng Thái Đơn Hàng
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
                      Phương Thức Thanh Toán
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
                      Trạng Thái Thanh Toán
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
                      Ngày Đặt Hàng
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
                    <tr key={item.orderId}>
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
                        {new Intl.NumberFormat("vi-VN").format(
                          item.totalAmount
                        )}{" "}
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
                        {item.orderHistoryStatus || "Không Có"}
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
                        {item.orderPayMethod || "Không có"}
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
                        {item.orderPayStatus || "Không có"}
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
                        {format(item.orderDate, "MM/dd/yyyy HH:mm") ||
                          "Không có"}
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
                          to={`/admin/customers/customer-orders/customer-order-items/${item.orderId}`}
                          className="btn btn-warning btn-sm"
                        >
                          <FontAwesomeIcon icon={faList} /> Xem Chi Tiết
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

export const AdminCustomerOrderItems = () => {
  const { id } = useParams();
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [prodList, setProdList] = useState();

  useEffect(() => {
    const fetchProdListByName = async () => {
      setIsLoading(false);
      try {
        const data = await getCustomerOrderItems(id);
        console.log("Customer Order Items: ", data);
        setProdList(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else if (
          err.status === 404 &&
          err.response.data === "Không có sản phẩm nào trong đơn hàng này."
        ) {
          setProdList();
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdListByName();
  }, [navigate, id]);

  return (
    <div className={clsx(styles["main-banners"])}>
      <Helmet>
        <title>Chi Tiết Đơn hàng</title>
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
        site="customers"
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
            <div className={clsx(styles["title"])}>Chi Tiết Đơn Hàng</div>
            <div className="d-flex justify-content-between align-items-center"></div>
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
                      Tên SP
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
                      Đơn Giá
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
                      Số Lượng
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
                      Tổng Tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prodList?.$values && prodList.$values.length > 0 ? (
                    prodList.$values.map((item, index) => (
                      <tr key={item.orderItemId}>
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
                          {item.productName || "Không Có"}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            maxWidth: "200px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN").format(item.price)} đ
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
                          {item.quantity || 0}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            maxWidth: "200px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN").format(
                            item.totalPrice
                          )}{" "}
                          đ
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        Không có sản phẩm nào trong đơn hàng này.
                      </td>
                    </tr>
                  )}
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
export default AdminCustomer;
