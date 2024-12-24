import clsx from "clsx";
import styles from "./AdminNavbar.module.css";
import {
  faBars,
  faRightFromBracket,
  faUser,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Switch from "../../SwitchButton/Switch";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { forgotPassword, getCustomerInfo } from "../../../api";
import { toast } from "react-toastify";

const AdminNavbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const navigate = useNavigate("");

  const [isHide, setIsHide] = useState(true);
  const { isChecked, handleChecked } = useContext(ThemeContext);
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const beURL = import.meta.env.VITE_BACKEND_URL;

  const handleHiddenOnclick = () => {
    setIsHide((prev) => !prev);
  };

  useEffect(() => {
    const AvatarData = async () => {
      const data = await getCustomerInfo();
      console.log("data: ", data);
      setAvatar(data.userImage);
      setEmail(data.email);
    };

    AvatarData();
  }, []);

  useEffect(() => {
    console.log("img:", beURL, avatar);
  }, [beURL, avatar]);

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
  });
  const handleLogout = () => setConfirmDelete({ isOpen: true });

  const confirmRemove = async () => {
    try {
      const isTokenExist = localStorage.getItem("token");
      if (isTokenExist) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
      setConfirmDelete({ isOpen: false });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const cancelRemove = () => setConfirmDelete({ isOpen: false });

  const handlePwdChange = async () => {
    try {
      toast.info("Vui lòng đợi, chúng tôi đang gửi mã đến email của bạn!");
      await forgotPassword(email);
      navigate("/input-token-reset-pwd");
    } catch (error) {
      console.log("lỗi khi đổi mk: ", error);
      toast.error("Có Lỗi Xảy Ra!");
    }
  };
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
          src={
            avatar
              ? `${beURL}${avatar}`
              : "/src/assets/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child.png"
          }
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
          to="/administrator/profile/edit"
          className={clsx(styles[isChecked ? "profile-light" : "profile"])}
        >
          Profile
          <FontAwesomeIcon icon={faUser} />
        </Link>

        <Link
          className={clsx(styles[isChecked ? "logout-light" : "logout"])}
          onClick={handlePwdChange}
        >
          Đổi Mật Khẩu
          <FontAwesomeIcon icon={faKey} />
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
      {confirmDelete.isOpen && (
        <div
          className={clsx(styles["my-confirm-delete-modal"])}
          onClick={cancelRemove}
        >
          <div
            className={clsx(styles["my-main-confirm-modal"])}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-danger">Xác nhận đăng xuất</h3>
            <p>Bạn có chắc chắn muốn đăng xuất không?</p>
            <div className="d-flex justify-content-between">
              <button className="btn btn-danger" onClick={confirmRemove}>
                Đăng Xuất
              </button>
              <button className="btn btn-secondary" onClick={cancelRemove}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AdminNavbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarCollapsed: PropTypes.bool,
};
export default AdminNavbar;
