import { useState } from "react";
import { forgotPassword } from "../../api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import clsx from "clsx";
import styles from "./FGPwd.module.css";
import { Helmet } from "react-helmet";

const Register = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (userEmail === "") {
        toast.error("Email không được để trống!");
        return;
      }
      const data = await forgotPassword(userEmail);
      toast.success(data);
      setTimeout(() => {
        navigate("/input-token-reset-pwd");
      }, 4000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else toast.error("Có lỗi xảy ra, vui lòng thử lại sau ít phút!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(styles["dmain"])}>
      <Helmet>
        <title>Quên Mật Khẩu</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
      <form onSubmit={handleSubmit} className={clsx(styles["fmain"])}>
        <div className={clsx(styles["div-header"])}>quên mật khẩu</div>
        <input
          className={clsx("form-control", styles["email-input"])}
          type="email"
          placeholder="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button
          type="submit"
          className={clsx("form-control", styles["btn-submit"])}
        >
          Gửi
        </button>
        <Link to="/login" className={clsx(styles["go-login"])}>
          Quay lại trang đăng nhập
        </Link>

        {isLoading && (
          <Loading className={clsx(styles["fg-loading"])}></Loading>
        )}
      </form>
    </div>
  );
};

export default Register;
