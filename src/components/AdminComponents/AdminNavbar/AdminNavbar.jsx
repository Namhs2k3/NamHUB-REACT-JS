import clsx from "clsx";
import styles from "./AdminNavbar.module.css";
import {
  faBars,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import Switch from "../../SwitchButton/Switch";
import { ThemeContext } from "../../../contexts/ThemeContext";

const AdminNavbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const navigate = useNavigate("");

  const [isHide, setIsHide] = useState(true);
  const { isChecked, handleChecked } = useContext(ThemeContext);

  const handleLogout = (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (confirmLogout) {
      const isTokenExist = localStorage.getItem("token");
      if (isTokenExist) {
        localStorage.removeItem("token");
      }
      navigate("/login");
    }
  };

  const handleHiddenOnclick = () => {
    setIsHide(!isHide);
  };

  return (
    <div
      className={clsx(
        styles["main-nav"],
        isSidebarCollapsed && styles["main-nav-collapsed"]
      )}
    >
      <FontAwesomeIcon
        icon={faBars}
        onClick={toggleSidebar}
        className={clsx(styles["menuButton"])}
      />
      <div className="d-flex justify-content-between align-items-center">
        <Switch isChecked={isChecked} handleCheck={handleChecked} />
        <img
          src="/src/assets/8-CQnrj2m9.jpg"
          alt=""
          className={clsx(styles["avatar"])}
          onMouseEnter={handleHiddenOnclick}
        />
      </div>
      <div
        className={clsx(styles["popup"], styles[isHide ? "popup-hidden" : ""])}
        onMouseLeave={handleHiddenOnclick}
      >
        <div className={clsx(styles["setting"])}>Settings</div>
        <Link to="/profile/edit" className={clsx(styles["profile"])}>
          Profile
          <FontAwesomeIcon icon={faUser} />
        </Link>

        <Link className={clsx(styles["logout"])} onClick={handleLogout}>
          Logout
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className={clsx(styles["turn-left"])}
          />
        </Link>
      </div>
    </div>
  );
};

AdminNavbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarCollapsed: PropTypes.bool,
};
export default AdminNavbar;
