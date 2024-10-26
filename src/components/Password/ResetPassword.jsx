// src/components/Register.jsx
import { useState } from "react";
import { resetPassword } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import clsx from 'clsx'
import styles from "./RSPwd.module.css"

const RSPwd = () => {
    const [userData, setUserData] = useState({
        token: "",
        newPassword: ""
    });
    const [confirmNewPwd, setConfirm] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (userData.newPassword === confirmNewPwd) {
                const data = await resetPassword(userData);
                toast.success(data)
                setTimeout(() => {
                    navigate("/input-token-reset-pwd");
                }, 4000)
            } else {
                toast.error("Mật Khẩu Không Trùng Khớp")
            }
        } catch (error) {
            toast.error(error.response.data)
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUserData({
            ...userData,
            [name]: value
        })
    }
    return (
        <div className={clsx(styles["dmain"])}>
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
                    type="text"
                    placeholder="New Password"
                    name="newPassword"
                    value={userData.newPassword}
                    onChange={handleInputChange}
                />
                <input
                    className={clsx("form-control", styles["input"])}
                    type="text"
                    placeholder="Confirm Password"
                    value={confirmNewPwd}
                    onChange={(e) => {
                        setConfirm(e.target.value)
                    }}
                />
                <button type="submit" className={clsx("form-control", styles["btn-submit"])}>Send</button>
                <ToastContainer />
            </form>
        </div>

    );
};

export default RSPwd;
