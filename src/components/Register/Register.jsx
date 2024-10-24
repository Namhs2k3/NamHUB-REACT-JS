// src/components/Register.jsx
import { useState } from "react";
import clsx from 'clsx';
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { register } from "../../api";
import styles from "./Register.module.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

const Register = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: ""
    });

    const [confirmPassword, setConfirmPwd] = useState("");
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
        try {
            if (userData.password !== confirmPassword) {
                toast.error("Mật khẩu xác nhận không khớp.");
                return;
            }
            const data = await register(userData);
            console.log(data)
            toast.success("Đăng ký thành công!");
            localStorage.setItem("email", userData.email)
            setTimeout(() => {
                toast.dismiss();
                navigate("/confirm-email");
            }, 2000); // Đợi 2 giây trước khi chuyển trang
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401 && error.response.data.message === "Email đã tồn tại.") {
                    toast.error("Email đã tồn tại.");
                } else if (error.response.status === 401 && error.response.data.message === "Tên người dùng đã tồn tại.") {
                    toast.error("Tên người dùng đã tồn tại.");
                } else {
                    toast.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!");
                }
            } else {
                toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className={clsx(styles["main-register"])}>
            <form className={clsx(styles.register)} onSubmit={handleSubmit}>
                <div className={clsx(styles["div-logo"])}>
                    <p className={clsx(styles["register-welcome"])}>Welcome to <span className={clsx(styles["big-logo"])}><span className={clsx(styles["child-logo-1"])}>Nam</span><span className={clsx(styles["child-logo-2"])}>HUB</span></span></p>
                </div>

                <input type="text"
                    className={clsx("form-control mb-3", styles["user-name"])}
                    id="floatingFN" placeholder="Full Name"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInputChange} />

                <input type="email"
                    className={clsx("form-control mb-3", styles["user-name"])}
                    id="floatingE" placeholder="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange} />

                <input type="text"
                    className={clsx("form-control mb-3", styles["user-name"])}
                    id="floatingUN" placeholder="User Name"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange} />

                <input type={showPassword ? "text" : "password"}
                    className={clsx("form-control mb-3", styles["password"])}
                    id="floatingPassword" placeholder="Password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange} />

                <input type={showPassword ? "text" : "password"}
                    className={clsx("form-control mb-3", styles["password"])}
                    id="floatingCPassword" placeholder="Confirm Password"
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={handleInputChangeForCfmPwd} />
                <div className={clsx(styles["hide-or-display"])} onClick={togglePasswordVisibility}>
                    <p>
                        {showPassword ? "Ẩn Mật Khẩu" : "Hiện Mật Khẩu"}
                    </p>
                </div>

                <div className={clsx(styles["div-btn-register"])}>
                    <button type="submit" className={clsx(styles["btn-register"])}>
                        Register
                    </button>
                </div>
                <div className={clsx(styles["div-go-login"])}>
                    <p>Already have an account? <span><Link to="/login" className={clsx(styles["btn-go-login"])}>Login</Link></span></p>
                </div>
            </form>
            {/* Hiển thị icon và toggle mật khẩu */}
            <div className={clsx(styles["div-eye"])}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={togglePasswordVisibility} className={clsx(styles["icon-eye"])} />
            </div>

            <ToastContainer />
        </div>
    );
};

export default Register;
