// src/components/Register.jsx
import { useState } from "react";
import { resetPassword } from "../../api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./RSPwd.module.css";
import Loading from "../Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>Thay Đổi Mật Khẩu</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
      <div className={clsx(styles["dsubMain"])}>
        <div className={clsx(styles["div-header"])}>Thay Đổi Mật Khẩu</div>
        <form onSubmit={handleSubmit} className={clsx(styles["fmain"])}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={clsx("form-control", styles["input"])}
              id="token"
              name="token"
              value={userData.token}
              onChange={handleInputChange}
              placeholder="Reset Password Token"
            />
            <label htmlFor="token">Reset Password Token</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className={clsx("form-control", styles["input"])}
              id="newPassword"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleInputChange}
              placeholder="New Password"
            />
            <label htmlFor="newPassword">New Password</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className={clsx("form-control", styles["input"])}
              id="confirmPassword"
              value={confirmNewPwd}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm Password"
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
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

          {isLoading && (
            <Loading className={clsx(styles["rs-loading"])}></Loading>
          )}
        </form>
      </div>
    </div>
  );
};

export default RSPwd;
