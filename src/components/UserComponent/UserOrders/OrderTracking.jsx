import { useCallback, useEffect, useState } from "react";
import styles from "./OrderTracking.module.css";
import { addNewState, getOrdersForCus } from "../../../api";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf } from "@fortawesome/free-solid-svg-icons";

const OrderTracking = () => {
  const [activeTab, setActiveTab] = useState("all");

  const [orders, setOrders] = useState([]);

  const fetchCusOrders = useCallback(async () => {
    try {
      const data = await getOrdersForCus();
      setOrders(data.$values[0].orders.$values || []);
      console.log("danh sách đơn hàng: ", data.$values);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCusOrders();
  }, [fetchCusOrders]);

  const filterOrders = (status) =>
    status === "all"
      ? orders
      : orders.filter((order) => order.status === status);

  const getOrderCountByStatus = (status) => {
    if (status === "all") {
      return orders.length;
    }
    return orders.filter((order) => order.status === status).length;
  };

  const handleCancelOrder = async (orderId) => {
    const yes = confirm("Bạn có chắc là muốn hủy đơn hàng này?");
    if (yes) {
      try {
        await addNewState(orderId, "Failed");
        toast.success("Hủy Đơn Hàng Thành Công!");
        fetchCusOrders();
      } catch (err) {
        console.log("có lỗi:", err);
        toast.error("Cập Nhật Trạng Thái Thất Bại!");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Các Đơn Hàng Của Tôi</h1>

      {/* Tabs */}
      <div className={styles.tabs}>
        {[
          "all",
          "Pending",
          "Preparing",
          "On Delivery",
          "Completed",
          "Failed",
          "Refunded",
        ].map((status) => {
          const orderCount = getOrderCountByStatus(status);
          return (
            <div
              key={status}
              className={`${styles.tab} ${activeTab === status ? styles.active : ""}`}
              onClick={() => setActiveTab(status)}
            >
              {status === "all"
                ? "Tất Cả"
                : status === "Pending"
                  ? "Chờ Xác Nhận"
                  : status === "Preparing"
                    ? "Đang Chuẩn Bị Món"
                    : status === "On Delivery"
                      ? "Đang Giao Hàng"
                      : status === "Completed"
                        ? "Hoàn Thành"
                        : status === "Failed"
                          ? "Đã Hủy"
                          : "Đã Hoàn Tiền"}
              {/* Hiển thị số lượng đơn hàng nếu lớn hơn 0 */}
              {orderCount > 0 && (
                <span className={styles.orderCount}>{orderCount}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Danh sách đơn hàng */}
      <div className={styles.orders}>
        {filterOrders(activeTab).length > 0 ? (
          filterOrders(activeTab).map((order) => (
            <div key={order.orderId} className={styles.orderCard}>
              <h2 className={styles.orderId}>Mã đơn: #{order.orderId}</h2>
              {order.status === "Failed" &&
              order.orderPayStatus === "Đã Thanh Toán" ? (
                <p className={styles.waitRefund}>
                  <FontAwesomeIcon icon={faHourglassHalf} /> Đợi Hoàn Tiền
                </p>
              ) : null}
              <p className={styles.orderDate}>
                Ngày đặt hàng: {format(order.orderDate, "dd/MM/yyyy HH:mm")}
              </p>
              <p className={styles.orderDate}>
                Cập nhật vào lúc:{" "}
                {format(order.statusUpdatedAt, "dd/MM/yyyy HH:mm")}
              </p>
              <p className={styles.orderStatus}>
                Trạng thái:{" "}
                <span className={`${styles.status} ${styles[order.status]}`}>
                  {order.status === "Pending"
                    ? "Chờ Xác Nhận"
                    : order.status === "Preparing"
                      ? "Đang Chuẩn Bị Món"
                      : order.status === "On Delivery"
                        ? "Đang Giao Hàng"
                        : order.status === "Completed"
                          ? "Hoàn Thành"
                          : order.status === "Failed"
                            ? "Đã Hủy"
                            : order.status === "Ready"
                              ? "Chờ Giao Hàng"
                              : "Đã Hoàn Tiền"}
                </span>
              </p>
              <p className={styles.orderPayMethod}>
                Phương thức thanh toán: {order.orderPayMethod}
              </p>
              <p className={styles.orderPayStatus}>
                Trạng thái thanh toán: {order.orderPayStatus}
              </p>
              <p className={styles.orderTotal}>
                Tổng cộng: {order.totalAmount.toLocaleString("vi-VN")}₫
              </p>
              {order.status === "Pending" && (
                <button
                  className={styles.cancelButton}
                  onClick={() => handleCancelOrder(order.orderId)}
                >
                  Hủy Đơn Hàng
                </button>
              )}
            </div>
          ))
        ) : (
          <p className={styles.noOrders}>Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
