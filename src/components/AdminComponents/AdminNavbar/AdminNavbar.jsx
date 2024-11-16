import clsx from "clsx";
import styles from "./AdminNavbar.module.css";
import {
  faBars,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";

const AdminNavbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const navigate = useNavigate("");

  const [isHide, setIsHide] = useState(true);
  const [isChecked, setIsChecked] = useState(true);

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

  const handleChecked = () => {
    setIsChecked((prev) => !prev);
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
        {
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              checked={isChecked}
              onClick={handleChecked}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckChecked"
            >
              {isChecked ? "Dark" : "Light"}
            </label>
          </div>
        }
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
