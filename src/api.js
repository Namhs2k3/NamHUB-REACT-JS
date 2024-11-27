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

// New User 


export const getAllUser = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const getNewUserByMonth = async (year,month) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/new-users?year=${year?? new Date().getFullYear()}&month=${month ?? new Date().getMonth()}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const getNewUserByQuater = async (year) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/new-users-by-year-group-by-quarter?year=${year??new Date().getFullYear()}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

//Món Bán Chạy
export const getBestSellerByQuater = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/best-sellers-by-quarter`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

// Doanh Thu
export const getTotalRevenue = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/revenue`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const getRevenueByMonth = async (year,month) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/revenue-by-time?year=${year??new Date().getFullYear()}&month=${month??new Date().getMonth()}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const getRevenueByQuarter= async (year,quarter) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/revenue-by-time?year=${year??new Date().getFullYear()}&quarter=${quarter??1}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const getRevenueByPeriodDate= async (start,end) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/revenue-by-date?startDate=${start}&endDate=${end}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

// Doanh thu theo payment method 
export const getRevenueByPaymentMethod= async (start,end) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/revenue-by-payment-method-in-period-time?startDate=${start}&endDate=${end}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

// Doanh thu theo Danh Mục 
export const getRevenueByCategory= async (start,end) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/revenue-by-category-in-period-time?startDate=${start}&endDate=${end}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};
// Doanh thu theo Sản Phẩm

export const getRevenueByProduct= async (start,end) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/revenue-by-product-in-period-time?startDate=${start}&endDate=${end}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

// Đơn Hàng 
export const getTotalOrders= async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/orders-count`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const getOrderCountByTime= async (start,end) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/orders-count-by-time?startDate=${start}&endDate=${end}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

// Best Seller 
export const getBestSeller= async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/best-seller-products`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const getBestSellerByQuarter= async (year) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/AdminStatistics/best-sellers-by-quarter?year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

// Product List

export const getProdList= async (name) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/product-manage-for-admin/get-products-list?name=${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const getProdListById= async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/product-manage-for-admin/get-products-list?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

export const updateProd= async (productId,formData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${backendUrl}/api/product-manage-for-admin/update-product/${productId}`,formData,{
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};

// Category 
export const getCategoryList= async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/categories-manage-for-admin/get-categories-list`, {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Authorization header vào yêu cầu
    }});
  return response.data;
};