import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminCustomer.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import {} from "../../../api";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";

const AdminCustomer = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={clsx(styles["main-customers"])}>
      <AdminSideBar
        site="customers"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["customer"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div
          className={clsx(styles[isChecked ? "main-light" : "main-dark"])}
        ></div>
      </div>
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};
export default AdminCustomer;
