// src/api.js
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl);
// Đăng nhập
export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/user-login/login`,
      credentials,
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    throw error; // Ném lỗi nếu có
  }
};

// Đăng ký
export const register = async (userData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/user-account/register`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    throw error;
  }
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/user-account/forgot-password`,
      { email },
    );
    return response.data;
  } catch (error) {
    console.error("Yêu cầu quên mật khẩu thất bại:", error);
    throw error;
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/user-account/reset-password`,
      resetData,
    );
    return response.data;
  } catch (error) {
    console.error("Đặt lại mật khẩu thất bại:", error);
    throw error;
  }
};
