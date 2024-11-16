import clsx from "clsx";
import styles from "./AdminSideBar.module.css";
import Logo from "../../Logo/Logo.jsx";
import Logo2 from "../../Logo/Logo2.jsx";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faChartSimple,
  faFaceSmile,
  faImage,
  faList,
  faTag,
  faCartShopping,
  faCircleUser,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Popup from "./Popup.jsx";

const AdminSideBar = ({ site, isSidebarCollapsed }) => {
  const theme = "dark";
  return (
    <div
      className={clsx(
        styles["main-side-bar"],
        isSidebarCollapsed && styles["collapsed"],
      )}
    >
      {!isSidebarCollapsed ? (
        <Logo theme={theme}></Logo>
      ) : (
        <Logo2 theme={theme}></Logo2>
      )}

      <div className="text-secondary fw-bold mb-3">
        {!isSidebarCollapsed ? "Dash Board" : ""}
      </div>

      <Link
        to="/admin/statistic"
        className={clsx(
          styles[!isSidebarCollapsed ? "statistic" : "statistic-collap"],
          styles[site === "statistic" ? "active" : ""],
        )}
      >
        {!isSidebarCollapsed ? "Statistic" : ""}
        <FontAwesomeIcon icon={faChartSimple} />
        {isSidebarCollapsed && (
          <Popup className={clsx(styles["tag-pop-up"])} tag="Statistic"></Popup>
        )}
      </Link>

      <div className="text-secondary fw-bold mb-3">
        {!isSidebarCollapsed ? "Management" : ""}
      </div>

      <Link
        to="/admin/products"
        className={clsx(
          styles[!isSidebarCollapsed ? "products" : "products-collap"],
          styles[site === "products" ? "active" : ""],
        )}
      >
        {!isSidebarCollapsed ? "Products" : ""}
        <FontAwesomeIcon icon={faBurger} />
        {isSidebarCollapsed && (
          <Popup className={clsx(styles["tag-pop-up"])} tag="Products"></Popup>
        )}
      </Link>

      <Link
        to="/admin/banners"
        className={clsx(
          styles[!isSidebarCollapsed ? "banners" : "banners-collap"],
          styles[site === "banners" ? "active" : ""],
        )}
      >
        {!isSidebarCollapsed ? "Banners" : ""}
        <FontAwesomeIcon icon={faImage} />
        {isSidebarCollapsed && (
          <Popup className={clsx(styles["tag-pop-up"])} tag="Banners"></Popup>
        )}
      </Link>

      <Link
        to="/admin/categories"
        className={clsx(
          styles[!isSidebarCollapsed ? "categories" : "categories-collap"],
          styles[site === "categories" ? "active" : ""],
        )}
      >
        {!isSidebarCollapsed ? "Categories" : ""}
        <FontAwesomeIcon icon={faList} />
        {isSidebarCollapsed && (
          <Popup
            className={clsx(styles["tag-pop-up"])}
            tag="Categories"
          ></Popup>
        )}
      </Link>

      <Link
        to="/admin/customers"
        className={clsx(
          styles[!isSidebarCollapsed ? "customers" : "customers-collap"],
          styles[site === "customers" ? "active" : ""],
        )}
      >
        {!isSidebarCollapsed ? "Customers" : ""}
        <FontAwesomeIcon icon={faFaceSmile} />
        {isSidebarCollapsed && (
          <Popup className={clsx(styles["tag-pop-up"])} tag="Customers"></Popup>
        )}
      </Link>

      <Link
        to="/admin/discounts"
        className={clsx(
          styles[!isSidebarCollapsed ? "discounts" : "discounts-collap"],
          styles[site === "discounts" ? "active" : ""],
        )}
      >
        {!isSidebarCollapsed ? "Discounts" : ""}
        <FontAwesomeIcon icon={faTag} />
        {isSidebarCollapsed && (
          <Popup className={clsx(styles["tag-pop-up"])} tag="Discounts"></Popup>
        )}
      </Link>

      <Link
        to="/admin/orders"
        className={clsx(
          styles[!isSidebarCollapsed ? "orders" : "orders-collap"],
          styles[site === "orders" ? "active" : ""],
        )}
      >
        {!isSidebarCollapsed ? "Orders" : ""}
        <FontAwesomeIcon icon={faCartShopping} />
        {isSidebarCollapsed && (
          <Popup className={clsx(styles["tag-pop-up"])} tag="Orders"></Popup>
        )}
      </Link>

      <Link
        to="/admin/users"
        className={clsx(
          styles[!isSidebarCollapsed ? "users" : "users-collap"],
          styles[site === "users" ? "active" : ""],
        )}
      >
        {!isSidebarCollapsed ? "Users" : ""}
        <FontAwesomeIcon icon={faCircleUser} />
        {isSidebarCollapsed && (
          <Popup className={clsx(styles["tag-pop-up"])} tag="Users"></Popup>
        )}
      </Link>

      <Link
        to="/home"
        className={clsx(styles[!isSidebarCollapsed ? "home" : "home-collap"])}
      >
        {!isSidebarCollapsed ? "Go to Home Page" : ""}
        <FontAwesomeIcon icon={faHouse} />
        {isSidebarCollapsed && (
          <Popup className={clsx(styles["tag-pop-up"])} tag="Home"></Popup>
        )}
      </Link>
    </div>
  );
};
AdminSideBar.propTypes = {
  site: PropTypes.string.isRequired, // xác định kiểu string cho theme
  isSidebarCollapsed: PropTypes.bool,
};
export default AdminSideBar;
