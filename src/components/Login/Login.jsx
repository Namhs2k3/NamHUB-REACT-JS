import { useState } from "react";
import clsx from 'clsx';
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import styles from "./Login.module.css";
import { login } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

const Login = () => {
    // State lưu thông tin đăng nhập và lỗi
    const [credentials, setCredentials] = useState({ userName: "", password: "" });
    const navigate = useNavigate();

    // Cập nhật thông tin đăng nhập vào state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    // Xử lý sự kiện đăng nhập
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Kiểm tra cả userName và password không được để trống
            if (credentials.userName !== "" && credentials.password !== "") {
                const data = await login(credentials);

                // Kiểm tra nếu API trả về phản hồi lỗi hoặc không có token
                // Tránh lỗi của API 
                if (!data || !data.token) {
                    toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.")
                } else {
                    // Lưu token vào localStorage và điều hướng đến trang Home
                    localStorage.setItem("token", data.token);
                    toast.success("Đăng nhập thành công!")
                    setTimeout(() => {
                        toast.dismiss();
                        navigate("/home");
                    }, 1000); // Đợi 1 giây trước khi chuyển trang
                }
            } else {
                toast.error("Tên đăng nhập và mật khẩu không được để trống.")
            }
        } catch (apiError) {
            // Xử lý lỗi từ API (ví dụ như lỗi 401 Unauthorized)
            if (apiError.response && apiError.response.status === 401) {
                toast.error("Đăng nhập thất bại! Sai tên đăng nhập hoặc mật khẩu.")
            } else {
                toast.error("Có lỗi xảy ra trong quá trình đăng nhập.")
            }
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={clsx(styles["main-login"])}>
            <form className={clsx(styles.login)} onSubmit={handleSubmit}>
                <div className={clsx(styles["div-logo"])}>
                    <p className={clsx(styles["login-welcome"])}>Welcome to <span className={clsx(styles["big-logo"])}><span className={clsx(styles["child-logo-1"])}>Nam</span><span className={clsx(styles["child-logo-2"])}>HUB</span></span></p>
                </div>

                <input type="text"
                    className={clsx("form-control mb-3", styles["user-name"])}
                    id="floatingInput" placeholder="User Name"
                    name="userName"
                    value={credentials.userName}
                    onChange={handleInputChange} />

                <input type={showPassword ? "text" : "password"}
                    className={clsx("form-control", styles["password"])}
                    id="floatingPassword" placeholder="Password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange} />

                <div className={clsx(styles["div-forgot"])}>
                    <Link to="/forgot-password" className={clsx(styles["forgot"])}>Forgot password?</Link>
                </div>
                <div className={clsx(styles["div-btn-login"])}>
                    <button type="submit" className={clsx(styles["btn-login"])}>
                        Login
                    </button>
                </div>
                <div>
                    <p>Don&apos;t have an account? <span><Link to="/register" className={clsx(styles["btn-create"])}>CREATE</Link></span></p>
                </div>
            </form>
            {/* Hiển thị icon và toggle mật khẩu */}
            <div className={clsx(styles["div-eye"])}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={togglePasswordVisibility} className={clsx(styles["icon-eye"])} />
            </div>

            <ToastContainer />
        </div>

    );
};

export default Login;
