// src/components/OrderDetail.jsx
import clsx from "clsx";
import styles from "./OrderItems.module.css";
import { useEffect, useState } from "react";
import { getOrderItemsForCus } from "../../../api";
import { useParams } from "react-router-dom";
import { formatCurrency } from "../../../formatCurrency";

const OrderItems = () => {
  const { id } = useParams();
  console.log("orderID: ", id);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const data = await getOrderItemsForCus(id);
        console.log("orderItems: ", data);
        setOrderItems(data.$values || []);
      } catch (error) {
        console.log(error);
        if (error.response.status === 400 || error.response.status === 404) {
          window.location.href = "/not-found";
        }
      }
    };
    fetchOrderItems();
  }, [id]);

  const total = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className={clsx(styles["order-detail-container"])}>
      <h1 className={clsx(styles["order-title"])}>CHI TIẾT ĐƠN HÀNG</h1>

      <div className={clsx(styles["section"], styles["recipient-info"])}>
        <h2>Thông tin người nhận</h2>
        <p>
          <strong>Tên người nhận: {orderItems[0]?.customerName ?? ""}</strong>
        </p>
        <p>
          <strong>Số điện thoại: {orderItems[0]?.customerPhone ?? ""}</strong>
        </p>
        <p>
          <strong>
            Địa chỉ nhận hàng: {orderItems[0]?.customerAddress ?? ""}
          </strong>
        </p>
      </div>

      <div className={clsx(styles["section"], styles["items-info"])}>
        <h2>Danh sách sản phẩm</h2>
        <ul>
          {orderItems.map((item, index) => (
            <li key={index} className={clsx(styles["item"])}>
              <span className={clsx(styles["item-name"])}>
                {item.productName}
              </span>
              <span className={clsx(styles["item-quantity"])}>
                {formatCurrency(item.unitPrice)}
              </span>
              <span className={clsx(styles["item-quantity"])}>
                x{item.quantity}
              </span>
              <span className={clsx(styles["item-price"])}>
                {formatCurrency(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={clsx(styles["section"], styles["total-info"])}>
        <h2>Tổng cộng</h2>
        <p className={clsx(styles["total-amount"])}>{formatCurrency(total)}</p>
      </div>
    </div>
  );
};

export default OrderItems;
