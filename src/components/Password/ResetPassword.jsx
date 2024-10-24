// src/components/ResetPassword.jsx
import { useState } from "react";
import { resetPassword } from "../../api";

const ResetPassword = () => {
    const [resetData, setResetData] = useState({
        token: "",
        newPassword: ""
    });
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await resetPassword(resetData);
            setMessage(data);
        } catch (error) {
            setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
            console.log(error)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Reset Token"
                value={resetData.token}
                onChange={(e) => setResetData({ ...resetData, token: e.target.value })}
            />
            <input
                type="password"
                placeholder="New Password"
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
            />
            <button type="submit">Reset Password</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ResetPassword;
