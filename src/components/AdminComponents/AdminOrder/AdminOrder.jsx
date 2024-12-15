import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminOrder.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { format } from "date-fns";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import { addNewState, getOrderHistory, getOrderList } from "../../../api";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faX } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const AdminOrder = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [status, setStatus] = useState("");
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [prodList, setProdList] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null); // Lưu trữ userId
  const handleOpenModal = (orderId) => {
    setCurrentOrderId(orderId); // Lưu userId
    setIsOpenModal(true); // Mở modal
  };

  useEffect(() => {
    const fetchProdListByName = async () => {
      setIsLoading(true);
      try {
        const data = await getOrderList(status);
        console.log("Order List: ", data);
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
  }, [navigate, status, isOpenModal]);

  return (
    <div className={clsx(styles["main-banners"])}>
      <Helmet>
        <title>Danh Sách Đơn Hàng</title>
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
        site="orders"
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
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <label
                htmlFor="statusFilter"
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span role="img" aria-label="filter">
                  🔍
                </span>
                Lọc Theo Trạng Thái
              </label>
              <select
                id="statusFilter"
                value={status}
                onChange={handleStatusChange}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  outline: "none",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = "#aaa")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              >
                <option value="">Tất Cả</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="On Delivery">On Delivery</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

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
                      Mã
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
                      Tên KH
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
                      SDT
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
                      Ngày Đặt
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
                      Tổng
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
                      Mã KM
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
                      Giảm
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
                      Phải Trả
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
                      PTTT
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
                      T.Toán
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
                  {prodList?.$values && prodList.$values.length > 0 ? (
                    prodList?.$values?.map((item, index) => (
                      <tr key={index}>
                        <th style={{ verticalAlign: "middle" }} scope="row">
                          {item.orderId}
                        </th>
                        <td
                          style={{
                            verticalAlign: "middle",
                            maxWidth: "200px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.fullName}
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
                          {format(item.orderDate, "MM/dd/yyyy HH:mm") ||
                            "Không có"}
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
                            item.totalAmount
                          )}{" "}
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
                          {item.discountCodeUsed || "Không có"}
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
                            item.discountAmount
                          )}{" "}
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
                          {new Intl.NumberFormat("vi-VN").format(
                            item.totalAfterDiscount
                          )}{" "}
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
                          {item.payment?.paymentMethod
                            ? item.payment.paymentMethod
                            : "Không Biết"}
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
                          {`${item.paymentStatus === "Đã Thanh Toán" ? "Rồi" : "Chưa"}` ||
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
                          {`${item.status}` || "Không biết"}
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
                          <button
                            onClick={() => handleOpenModal(item.orderId)}
                            className="btn btn-warning btn-sm me-1"
                          >
                            <FontAwesomeIcon icon={faClockRotateLeft} /> LSDH
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isOpenModal && (
        <OpenModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          orderId={currentOrderId}
        />
      )}
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};

const OpenModal = ({ isOpenModal, setIsOpenModal, orderId }) => {
  const [orderHistoryStatus, setOrderHistoryStatus] = useState([]);
  const [status, setStatus] = useState("");
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Đóng modal khi click bên ngoài
  const handleClick = () => {
    setIsOpenModal(false);
  };

  // Ngăn chặn sự kiện lan truyền khi click bên trong modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const fetchOrderHistory = useCallback(async () => {
    if (!orderId) return; // Không làm gì nếu orderId không hợp lệ
    try {
      const data = await getOrderHistory(orderId);
      console.log("Order History: ", data);
      setOrderHistoryStatus(data?.$values || []);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu: ", err);
      toast.error("Lỗi khi lấy dữ liệu!");
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    const dataSend = status;
    try {
      await addNewState(orderId, dataSend);
      toast.success("Cập Nhật Trạng Thái Thành Công!");
      fetchOrderHistory();
    } catch (err) {
      console.log("có lỗi:", err);
      toast.error("Cập Nhật Trạng Thái Thất Bại!");
    }
  };
  return (
    <>
      {isOpenModal && (
        <Fragment>
          <div
            onClick={handleClick}
            className={clsx(styles["my-big-modal"])}
          ></div>

          <div
            className={clsx(styles["my-main-modal"])}
            onClick={handleModalClick}
          >
            <div className={clsx(styles["update-title"])}>
              <h2 className="text-secondary fw-bold">Lịch Sử Đơn Hàng</h2>
              <div onClick={handleClick} className={clsx(styles["btn-x"])}>
                <FontAwesomeIcon icon={faX} />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center py-4">
              <p className="w-100 text-center">
                Đơn Hàng: <span className="text-success">#{orderId}</span>
              </p>
            </div>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <label
                htmlFor="statusFilter"
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                Cập Nhật Trạng Thái Mới
              </label>
              <select
                id="statusFilter"
                value={status}
                onChange={handleStatusChange}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  outline: "none",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = "#aaa")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              >
                <option value="">Không</option>

                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="On Delivery">On Delivery</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
              <button
                className="btn btn-success text-white"
                onClick={handleUpdateStatus}
                disabled={
                  status === "" ||
                  orderHistoryStatus?.some((item) => item.status === status) ||
                  orderHistoryStatus?.some(
                    (item) => item.status === "Completed"
                  )
                }
              >
                Cập Nhật
              </button>
            </div>
            {/* Danh sách trạng thái đơn hàng */}
            <div className="py-3">
              {orderHistoryStatus.length > 0 ? (
                <div className={clsx(styles["div-table-modal"])}>
                  <table className="table table-striped">
                    <thead className={clsx(styles["custom-thead"])}>
                      <tr>
                        <th>#</th>
                        <th>Trạng Thái</th>
                        <th>Ngày Cập Nhật</th>
                        <th>Người Cập Nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistoryStatus.map((item, index) => (
                        <tr key={item.historyId}>
                          <td>{index + 1}</td>
                          <td>{item.status || "Không biết"}</td>
                          <td>{format(item.updatedAt, "MM/dd/yyyy HH:mm")}</td>
                          <td>
                            {item.updatedBy === "Unknow User"
                              ? "Không rõ"
                              : item.updatedBy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-danger">
                  Không có lịch sử trạng thái nào.
                </p>
              )}
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-info w-75" onClick={handleClick}>
                OK
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
};
OpenModal.propTypes = {
  isOpenModal: PropTypes.bool,
  setIsOpenModal: PropTypes.func,
  orderId: PropTypes.number,
};
export default AdminOrder;
