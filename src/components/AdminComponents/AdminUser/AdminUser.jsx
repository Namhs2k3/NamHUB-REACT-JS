import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminUser.module.css";
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

const AdminUser = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={clsx(styles["main-users"])}>
      <AdminSideBar
        site="users"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["user"])}>
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
export default AdminUser;
