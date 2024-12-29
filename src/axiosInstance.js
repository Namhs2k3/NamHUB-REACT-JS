import axios from "axios";
import { refreshToken } from "./api"; // Hàm gọi API refresh token

// Tạo instance của Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Đặt URL mặc định
});

// Quản lý trạng thái làm mới token
let isRefreshing = false; // Có đang làm mới token không
let refreshSubscribers = []; // Danh sách các request chờ token mới

// Hàm thông báo token mới cho các request đang chờ
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Kiểm tra token sắp hết hạn
const isTokenExpiring = (token) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp * 1000;
  return Date.now() >= exp - 5 * 60 * 1000; // Hết hạn trong 5 phút
};

// Interceptor cho request
let cachedToken = localStorage.getItem("token");

apiClient.interceptors.request.use(async (config) => {
  if (cachedToken) {
    // Kiểm tra token sắp hết hạn
    if (isTokenExpiring(cachedToken)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Gọi API làm mới token
          const { token: newToken, refreshToken: newRefreshToken } = await refreshToken();

          // Cập nhật cả access token và refresh token
          cachedToken = newToken; // Lưu token vào bộ nhớ tạm
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken); // Cập nhật refresh token

          // Cập nhật header Authorization mặc định
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        } catch (error) {
          console.error("Làm mới token thất bại:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
          throw error;
        } finally {
          isRefreshing = false;
        }
      }
    }
    // Gán token từ bộ nhớ tạm vào headers
    config.headers["Authorization"] = `Bearer ${cachedToken}`;
  }
  return config;
});


// Interceptor cho response để xử lý lỗi 401 và tự động refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa gửi request refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
      && cachedToken
    ) {
      originalRequest._retry = true; // Đánh dấu đã retry

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Gọi API làm mới token
          const { token: newToken, refreshToken: newRefreshToken } = await refreshToken();

          // Cập nhật token mới vào localStorage
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Cập nhật headers của axios instance
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          // Thông báo token mới cho các request đang chờ
          onRefreshed(newToken);
          isRefreshing = false;
        } catch (refreshError) {
          console.error("Làm mới token thất bại:", refreshError);
          isRefreshing = false;
          return Promise.reject(refreshError); // Không xử lý được, ném lỗi
        }
      }

      // Đợi token mới và gửi lại request
      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error); // Trả về lỗi nếu không phải lỗi 401
  }
);

export default apiClient;
