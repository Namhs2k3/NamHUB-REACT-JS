import { useState } from "react";
import styles from "./OrderTracking.module.css";

const OrderTracking = () => {
  const [activeTab, setActiveTab] = useState("all");

  const orders = [
    { id: 1, status: "pending", name: "Order 001", total: 150 },
    { id: 2, status: "shipping", name: "Order 002", total: 200 },
    { id: 3, status: "completed", name: "Order 003", total: 350 },
    { id: 4, status: "canceled", name: "Order 004", total: 100 },
  ];

  const filterOrders = (status) =>
    status === "all"
      ? orders
      : orders.filter((order) => order.status === status);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Các Đơn Hàng Của Tôi</h1>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === "all" ? styles.active : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất Cả
        </div>
        <div
          className={`${styles.tab} ${activeTab === "pending" ? styles.active : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Chờ Thanh Toán
        </div>
        <div
          className={`${styles.tab} ${activeTab === "shipping" ? styles.active : ""}`}
          onClick={() => setActiveTab("shipping")}
        >
          Chờ Giao Hàng
        </div>
        <div
          className={`${styles.tab} ${activeTab === "completed" ? styles.active : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Hoàn Thành
        </div>
        <div
          className={`${styles.tab} ${activeTab === "canceled" ? styles.active : ""}`}
          onClick={() => setActiveTab("canceled")}
        >
          Đã Hủy
        </div>
      </div>

      <div className={styles.orders}>
        {filterOrders(activeTab).length > 0 ? (
          filterOrders(activeTab).map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <h2 className={styles.orderName}>{order.name}</h2>
              <p className={styles.orderStatus}>
                Trạng thái:{" "}
                <span className={`${styles.status} ${styles[order.status]}`}>
                  {order.status === "pending"
                    ? "Chờ Thanh Toán"
                    : order.status === "shipping"
                      ? "Chờ Giao Hàng"
                      : order.status === "completed"
                        ? "Hoàn Thành"
                        : "Đã Hủy"}
                </span>
              </p>
              <p className={styles.orderTotal}>Tổng cộng: ${order.total}</p>
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
