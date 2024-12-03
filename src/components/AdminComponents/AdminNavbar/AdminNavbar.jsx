import clsx from "clsx";
import styles from "./AdminNavbar.module.css";
import {
  faBars,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Switch from "../../SwitchButton/Switch";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { getUserInfo } from "../../../api";

const AdminNavbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const navigate = useNavigate("");

  const [isHide, setIsHide] = useState(true);
  const { isChecked, handleChecked } = useContext(ThemeContext);
  const [avatar, setAvatar] = useState("");
  const beURL = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (confirmLogout) {
      const isTokenExist = localStorage.getItem("token");
      if (isTokenExist) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
      navigate("/login");
    }
  };

  const handleHiddenOnclick = () => {
    setIsHide(!isHide);
  };

  useEffect(() => {
    const AvatarData = async () => {
      const data = await getUserInfo();
      console.log("data: ", data);
      setAvatar(data.userImage);
    };

    AvatarData();
  }, []);

  useEffect(() => {
    console.log("img:", beURL, avatar);
  }, [beURL, avatar]);
  return (
    <div
      className={clsx(
        styles[!isChecked ? "main-nav" : "main-nav-light"],
        isSidebarCollapsed &&
          styles[!isChecked ? "main-nav-collapsed" : "main-nav-collapsed-light"]
      )}
    >
      <FontAwesomeIcon
        icon={faBars}
        onClick={toggleSidebar}
        className={clsx(styles[!isChecked ? "menuButton" : "menuButton-light"])}
      />
      <div className="d-flex justify-content-between align-items-center">
        <Switch isChecked={isChecked} handleCheck={handleChecked} />
        <img
          src={`${beURL}${avatar}`}
          alt=""
          className={clsx(styles["avatar"])}
          onMouseEnter={handleHiddenOnclick}
          onMouseLeave={handleHiddenOnclick}
        />
      </div>
      <div
        className={clsx(
          styles[isChecked ? "popup-light" : "popup"],
          styles[isHide ? "popup-hidden" : ""]
        )}
        onMouseLeave={handleHiddenOnclick}
        onMouseEnter={handleHiddenOnclick}
      >
        <div className={clsx(styles[isChecked ? "setting-light" : "setting"])}>
          Settings
        </div>
        <Link
          to="/admin/profile/edit"
          className={clsx(styles[isChecked ? "profile-light" : "profile"])}
        >
          Profile
          <FontAwesomeIcon icon={faUser} />
        </Link>

        <Link
          className={clsx(styles[isChecked ? "logout-light" : "logout"])}
          onClick={handleLogout}
        >
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
