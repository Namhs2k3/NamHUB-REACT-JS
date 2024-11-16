// src/components/Register.jsx
import { useState } from "react";
import { resetPassword } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./RSPwd.module.css";
import Loading from "../Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const RSPwd = () => {
  const [userData, setUserData] = useState({
    token: "",
    newPassword: "",
  });
  const [confirmNewPwd, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (userData.newPassword === confirmNewPwd) {
        const data = await resetPassword(userData);
        toast.success(data);
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      } else {
        toast.error("Mật Khẩu Không Trùng Khớp");
      }
    } catch (error) {
      const err = error.response?.data || "Có lỗi xảy ra!";
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={clsx(styles["dmain"])}>
      <div className={clsx(styles["dsubMain"])}>
        <div className={clsx(styles["div-header"])}>Thay Đổi Mật Khẩu</div>
        <form onSubmit={handleSubmit} className={clsx(styles["fmain"])}>
          <input
            className={clsx("form-control", styles["input"])}
            type="text"
            placeholder="Reset Password Token"
            name="token"
            value={userData.token}
            onChange={handleInputChange}
          />
          <input
            className={clsx("form-control", styles["input"])}
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            name="newPassword"
            value={userData.newPassword}
            onChange={handleInputChange}
          />
          <input
            className={clsx("form-control", styles["input"])}
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmNewPwd}
            onChange={(e) => {
              setConfirm(e.target.value);
            }}
          />
          {/* Hiển thị icon và toggle mật khẩu */}
          <div className={clsx(styles["div-eye"])}>
            <span>{showPassword ? "Ẩn Mật Khẩu " : "Hiện Mật Khẩu "}</span>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className={clsx(styles["icon-eye"])}
            />
          </div>
          <button
            type="submit"
            className={clsx("form-control", styles["btn-submit"])}
          >
            Save
          </button>
          <Link to="/login" className={clsx(styles["go-login"])}>
            Quay lại trang đăng nhập
          </Link>
          <ToastContainer />
          {isLoading && (
            <Loading className={clsx(styles["rs-loading"])}></Loading>
          )}
        </form>
      </div>
    </div>
  );
};

export default RSPwd;
