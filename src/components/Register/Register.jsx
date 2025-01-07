// src/components/Register.jsx
import { useState } from "react";
import clsx from "clsx";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { register } from "../../api";
import Loading from "../Loading/Loading";
import styles from "./Register.module.css";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const [confirmPassword, setConfirmPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Cập nhật thông tin đăng ký vào state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleInputChangeForCfmPwd = (e) => {
    const { value } = e.target;
    setConfirmPwd(value);
  };

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Kiểm tra nếu username có chứa dấu hoặc khoảng trống
      const usernamePattern = /^[A-Za-z0-9]*$/; // Không có dấu và không có khoảng trắng
      if (!usernamePattern.test(userData.username)) {
        toast.error("Tên người dùng không được chứa dấu hoặc khoảng trống.");
        setIsLoading(false); // Dừng loading nếu có lỗi
        return;
      }
      if (userData.password !== confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp.");
        return;
      }
      const data = await register(userData);
      console.log(data);
      toast.success("Đăng ký thành công!");
      localStorage.setItem("email", userData.email);
      setTimeout(() => {
        toast.dismiss();
        navigate("/confirm-email");
      }, 2000); // Đợi 2 giây trước khi chuyển trang
    } catch (error) {
      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data === "Email đã tồn tại."
        ) {
          toast.error("Email đã tồn tại.");
        } else if (
          error.response.status === 400 &&
          error.response.data === "Tên người dùng đã tồn tại."
        ) {
          toast.error("Tên người dùng đã tồn tại.");
        } else {
          toast.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!");
        }
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={clsx(styles["main-register"])}>
      <Helmet>
        <title>Đăng Ký Tài Khoản</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
      <form className={clsx(styles.register)} onSubmit={handleSubmit}>
        <div className={clsx(styles["div-logo"])}>
          <p className={clsx(styles["register-welcome"])}>
            Register to{" "}
            <span className={clsx(styles["big-logo"])}>
              <span className={clsx(styles["child-logo-1"])}>Nam</span>
              <span className={clsx(styles["child-logo-2"])}>HUB</span>
            </span>
          </p>
        </div>

        <input
          type="text"
          className={clsx("form-control mb-3", styles["user-name"])}
          id="floatingFN"
          placeholder="Full Name"
          name="fullName"
          value={userData.fullName}
          onChange={handleInputChange}
          required
        />

        <input
          type="email"
          className={clsx("form-control mb-3", styles["user-name"])}
          id="floatingE"
          placeholder="Email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
        />

        <input
          type="text"
          className={clsx("form-control mb-3", styles["user-name"])}
          id="floatingUN"
          placeholder="User Name"
          name="username"
          value={userData.username.replace(" ", "")}
          onChange={handleInputChange}
        />

        <input
          type={showPassword ? "text" : "password"}
          className={clsx("form-control mb-3", styles["password"])}
          id="floatingPassword"
          placeholder="Password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
        />

        <input
          type={showPassword ? "text" : "password"}
          className={clsx("form-control mb-3", styles["password"])}
          id="floatingCPassword"
          placeholder="Confirm Password"
          name="confirm-password"
          value={confirmPassword}
          onChange={handleInputChangeForCfmPwd}
        />
        <div
          className={clsx(styles["hide-or-display"])}
          onClick={togglePasswordVisibility}
        >
          <p>{showPassword ? "Ẩn Mật Khẩu" : "Hiện Mật Khẩu"}</p>
        </div>

        <div className={clsx(styles["div-btn-register"])}>
          <button type="submit" className={clsx(styles["btn-register"])}>
            Đăng Ký
          </button>
        </div>
        <div className={clsx(styles["div-go-login"])}>
          <p>
            Đã có tài khoản?{" "}
            <span>
              <Link to="/login" className={clsx(styles["btn-go-login"])}>
                Đăng Nhập
              </Link>
            </span>
          </p>
        </div>
      </form>
      {/* Hiển thị icon và toggle mật khẩu */}
      <div className={clsx(styles["div-eye"])}>
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          onClick={togglePasswordVisibility}
          className={clsx(styles["icon-eye"])}
        />
      </div>

      {isLoading && (
        <Loading className={clsx(styles["regis-loading"])}></Loading>
      )}
    </div>
  );
};

export default Register;
