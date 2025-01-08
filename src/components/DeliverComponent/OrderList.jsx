import { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./OrderList.module.css"; // Đảm bảo có CSS module phù hợp
import {
  addNewState,
  getCustomerOrderItems,
  getOrderListForDeliver,
  orderCompleted,
} from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Unauthorized } from "../Unauthorized/Unauth";
import Loading from "../Loading/Loading";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleInfo, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Helmet } from "react-helmet";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isPermitted, setPermitted] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getOrderListForDeliver();
        console.log("Order List: ", data);
        setOrders(data.$values || []);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/login");
        } else if (err.status === 403) {
          setPermitted(false);
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
    // Kết nối SignalR
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_BACKEND_URL}/orderHub`) // Đảm bảo URL đúng với backend
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR connected.");
        // Lắng nghe sự kiện 'OrderUpdated'
        connection.on("OrderUpdated", (orderId, status) => {
          if (status) {
            toast(
              `Đơn hàng #${orderId} đã được cập nhật trạng thái: ${status}`
            );
          } else {
            toast(`Đơn hàng #${orderId} đã được cập nhật trạng thái`);
          }
          fetchProductDetails(); // Cập nhật danh sách đơn hàng
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    // Cleanup khi component unmount
    return () => {
      connection.stop();
    };
  }, [navigate]);

  const handleAcceptOrder = async (orderId) => {
    try {
      setIsLoading(true);
      await addNewState(orderId, "On Delivery");
      toast.info(`Đã nhận đơn hàng: #${orderId}`);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu: ", err);
      if (err.status === 401) {
        navigate("/login");
      } else if (err.status === 403) {
        setPermitted(false);
      } else {
        navigate("/not-found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliverySuccess = async (orderId) => {
    try {
      setIsLoading(true);
      await orderCompleted(orderId);
      toast.success(`Giao thành công đơn hàng: #${orderId}`);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu: ", err);
      if (err.status === 401) {
        navigate("/login");
      } else if (err.status === 403) {
        setPermitted(false);
      } else {
        navigate("/not-found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliveryFailure = async (orderId) => {
    try {
      setIsLoading(true);
      await addNewState(orderId, "Failed");
      toast.warning(`Đơn hàng #${orderId} giao thất bại!`);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu: ", err);
      if (err.status === 401) {
        navigate("/login");
      } else if (err.status === 403) {
        setPermitted(false);
      } else {
        navigate("/not-found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPermitted) return <Unauthorized />;

  return (
    <div className={clsx(styles.container)}>
      <Helmet>
        <title>Danh Sách Đơn Hàng Đang Đợi</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
      <h1 className={clsx(styles.title)}>Danh Sách Đơn Hàng</h1>
      {isLoading ? (
        <Loading className={clsx(styles["loading"])} />
      ) : orders.length === 0 ? (
        <div className={clsx(styles.noOrders)}>
          <p>Hiện không có đơn hàng nào.</p>
        </div>
      ) : (
        <div className={clsx(styles.cardContainer)}>
          {orders.map((order) => (
            <div key={order.orderId} className={clsx(styles.card)}>
              <div className={clsx(styles.cardHeader)}>
                <h2 className={clsx(styles.orderId)}>
                  Mã Đơn: #{order.orderId}
                </h2>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={clsx(styles.status, {
                      [styles.ready]: order.status === "Ready",
                      [styles.onDelivery]: order.status === "On Delivery",
                    })}
                  >
                    <FontAwesomeIcon
                      icon={
                        order.status === "Ready" ? faCheckCircle : faTruckFast
                      }
                      className="me-1"
                    />
                    {order.status === "On Delivery" ? "Delivery" : "Ready"}
                  </span>

                  <Link
                    to={`/deliver/order-details/${order.orderId}`}
                    className={clsx(styles.actionButton, styles.detailsButton)}
                  >
                    <FontAwesomeIcon icon={faCircleInfo} /> Chi Tiết
                  </Link>
                </div>
              </div>
              <div className={clsx(styles.cardBody)}>
                <p>
                  <strong>Khách Hàng:</strong> {order.fullName}
                </p>
                <p>
                  <strong>Điện Thoại:</strong> {order.phone}
                </p>
                <p>
                  <strong>Địa Chỉ:</strong> {order.customerAddress}
                </p>
                <p>
                  <strong>Ngày Đặt:</strong>{" "}
                  {format(new Date(order.orderDate), "MM/dd/yyyy HH:mm")}
                </p>
                <p>
                  <strong>Thành Tiền:</strong>{" "}
                  {order.totalAmount.toLocaleString()} VND
                </p>
                <p>
                  <strong>Thanh Toán:</strong> {order.paymentMethod}
                </p>
                <div className={clsx(styles.actionButtons)}>
                  {order.status === "Ready" && (
                    <button
                      className={clsx(styles.actionButton, styles.acceptButton)}
                      onClick={() => handleAcceptOrder(order.orderId)}
                    >
                      Nhận Đơn
                    </button>
                  )}
                  {order.status === "On Delivery" && (
                    <>
                      <button
                        className={clsx(
                          styles.actionButton,
                          { [styles.successButton]: order.isByThisUser },
                          { [styles.disabledButton]: !order.isByThisUser }
                        )}
                        onClick={() => handleDeliverySuccess(order.orderId)}
                        disabled={!order.isByThisUser}
                      >
                        Giao Thành Công
                      </button>
                      <button
                        className={clsx(
                          styles.actionButton,
                          { [styles.failureButton]: order.isByThisUser },
                          { [styles.disabledButton]: !order.isByThisUser }
                        )}
                        onClick={() => handleDeliveryFailure(order.orderId)}
                        disabled={!order.isByThisUser}
                      >
                        Giao Thất Bại
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderItems, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await getCustomerOrderItems(orderId);
        setOrder(data.$values || []);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng: ", err);
        if (err.status === 401) {
          navigate("/login");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [navigate, orderId]);

  if (isLoading) return <Loading className={clsx(styles["loading"])} />;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Chi Tiết Đơn Hàng</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
      <h1 className={styles.title}>Chi Tiết Đơn Hàng #{orderId}</h1>

      {orderItems.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên Sản Phẩm</th>
              <th>Đơn Giá</th>
              <th>Số Lượng</th>
              <th>Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={item.orderItemId}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.price.toLocaleString()} VND</td>
                <td>{item.quantity}</td>
                <td>{item.totalPrice.toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noOrderMessage}>
          Không có sản phẩm nào trong đơn hàng này.
        </p>
      )}

      <div className="d-flex align-items-center justify-content-center">
        <button
          onClick={() => window.history.back()}
          className={clsx(styles.actionButton, styles.backButton)}
        >
          Quay Lại
        </button>
      </div>
    </div>
  );
};

export default OrderList;
