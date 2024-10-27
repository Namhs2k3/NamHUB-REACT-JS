// src/components/Register.jsx
import { useState } from "react";
import { forgotPassword } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import clsx from 'clsx'
import styles from "./FGPwd.module.css"

const Register = () => {
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await forgotPassword(userEmail);
            toast.success(data)
            setTimeout(() => {
                navigate("/input-token-reset-pwd");
            }, 4000)
        } catch (error) {
            toast.error(error.response.data)
        }
    };

    return (
        <div className={clsx(styles["dmain"])}>
            <form onSubmit={handleSubmit} className={clsx(styles["fmain"])}>
                <div className={clsx(styles["div-header"])}>Nhập Email Của Bạn</div>
                <input
                    className={clsx("form-control", styles["email-input"])}
                    type="email"
                    placeholder="Email"
                    value={userEmail}
                    onChange={(e) => {
                        setUserEmail(e.target.value)
                    }}
                />
                <button type="submit" className={clsx("form-control", styles["btn-submit"])}>Send</button>
                <Link to="/login" className={clsx(styles["go-login"])}>Quay lại trang đăng nhập</Link>

                <ToastContainer />
            </form>
        </div>

    );
};

export default Register;
