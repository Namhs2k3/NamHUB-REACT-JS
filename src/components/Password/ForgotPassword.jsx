// src/components/Register.jsx
import { useState } from "react";
import { register } from "../../api";

const Register = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: ""
    });
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await register(userData);
            setMessage(data);
        } catch (error) {
            setMessage("Đăng ký thất bại. Vui lòng thử lại.");
            console.log(error)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
            <input
                type="text"
                placeholder="Full Name"
                value={userData.fullName}
                onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
            />
            <button type="submit">Register</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default Register;
