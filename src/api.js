// src/api.js
import axios from "axios";
import apiClient from "./axiosInstance";

const baseURL = import.meta.env.VITE_BACKEND_URL

// Đăng nhập
export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/user-login/login`,
      credentials,
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    throw error; // Ném lỗi nếu có
  }
};

export const refreshToken = async () => {
  const currentRefreshToken = localStorage.getItem("refreshToken");
  if (!currentRefreshToken) {
    throw new Error("Refresh Token không tồn tại");
  }

  try {
    const response = await axios.post(`${baseURL}/api/user-login/refresh-token`, {
      token: currentRefreshToken,
    });

    // Cập nhật refresh token mới
    localStorage.setItem("refreshToken", response.data.refreshToken);

    // Trả về Access Token mới
    return response.data;
  } catch (error) {
    console.error("Làm mới Access Token thất bại:", error.response?.data || error.message);
    throw error; // Ném lỗi để thông báo thất bại
  }
};



// Đăng ký
export const register = async (userData) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/user-account/register`,
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
      `${baseURL}/api/user-account/forgot-password`,
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
      `${baseURL}/api/user-account/reset-password`,
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
  
  const response = await apiClient.get(`/api/AdminStatistics/all-users`);
  return response.data;
};

export const getNewUserByMonth = async (year,month) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/new-users?year=${year?? new Date().getFullYear()}&month=${month ?? new Date().getMonth()}`);
  return response.data;
};

export const getNewUserByQuater = async (year) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/new-users-by-year-group-by-quarter?year=${year??new Date().getFullYear()}`);
  return response.data;
};

//Món Bán Chạy
export const getBestSellerByQuater = async () => {
  
  const response = await apiClient.get(`/api/AdminStatistics/best-sellers-by-quarter`);
  return response.data;
};

// Doanh Thu
export const getTotalRevenue = async () => {
  
  const response = await apiClient.get(`/api/AdminStatistics/revenue`);
  return response.data;
};

export const getRevenueByMonth = async (year,month) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/revenue-by-time?year=${year??new Date().getFullYear()}&month=${month??new Date().getMonth()}`);
  return response.data;
};

export const getRevenueByQuarter= async (year,quarter) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/revenue-by-time?year=${year??new Date().getFullYear()}&quarter=${quarter??1}`);
  return response.data;
};

export const getRevenueByPeriodDate= async (start,end) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/revenue-by-date?startDate=${start}&endDate=${end}`);
  return response.data;
};

// Doanh thu theo payment method 
export const getRevenueByPaymentMethod= async (start,end) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/revenue-by-payment-method-in-period-time?startDate=${start}&endDate=${end}`);
  return response.data;
};

// Doanh thu theo Danh Mục 
export const getRevenueByCategory= async (start,end) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/revenue-by-category-in-period-time?startDate=${start}&endDate=${end}`);
  return response.data;
};
// Doanh thu theo Sản Phẩm

export const getRevenueByProduct= async (start,end) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/revenue-by-product-in-period-time?startDate=${start}&endDate=${end}`);
  return response.data;
};

// Đơn Hàng 
export const getTotalOrders= async () => {
  
  const response = await apiClient.get(`/api/AdminStatistics/orders-count`);
  return response.data;
};

export const getOrderCountByTime= async (start,end) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/orders-count-by-time?startDate=${start}&endDate=${end}`);
  return response.data;
};

// Best Seller 
export const getBestSeller= async () => {
  
  const response = await apiClient.get(`/api/AdminStatistics/best-seller-products`);
  return response.data;
};

export const getBestSellerByQuarter= async (year) => {
  
  const response = await apiClient.get(`/api/AdminStatistics/best-sellers-by-quarter?year=${year}`);
  return response.data;
};

// Product List

export const getProdList= async (name) => {
  
  const response = await apiClient.get(`/api/product-manage-for-admin/get-products-list${name?`?name=${name}`:""}`);
  return response.data;
};

export const getProdListById= async (id) => {
  
  const response = await apiClient.get(`/api/product-manage-for-admin/get-products-list?id=${id}`);
  return response.data;
};

export const updateProd= async (productId,formData) => {
  
  const response = await apiClient.put(`/api/product-manage-for-admin/update-product/${productId}`,formData,);
  return response.data;
};

// Category 
export const getCategoryList= async () => {
  
  const response = await apiClient.get(`/api/categories-manage-for-admin/get-categories-list`, );
  return response.data;
};

// User Account Manage 
export const getUserList= async () => {
  
  const response = await apiClient.get(`/api/users-account-manage-for-admin/get-list-user-account`, );
  return response.data;
};

export const updateUserRoles= async (id,roles) => {
  
  const response = await apiClient.put(`/api/users-account-manage-for-admin/update-user-role/${id}`, roles);
  return response.data;
};

export const removeUser = async (id) => {
  
  const response = await apiClient.delete(`/api/users-account-manage-for-admin/delete-employee/${id}`);
  return response.data;
};

export const addEmployee = async (empInfo) => {
  
  const response = await apiClient.post(`/api/users-account-manage-for-admin/add-employee`, empInfo);
  return response.data;
};

export const getUserInfo = async () => {
  
  const response = await apiClient.get(`/api/user-info/get-info`);
  return response.data;
};

export const editProfile = async (formData) => {
  
  const response = await apiClient.put(`/api/user-info/update-info`, formData);
  return response.data;
};

//Địa Chỉ
export const getUserAddresses = async () => {
  
  const response = await apiClient.get(`/api/user-info/get-user-addresses`);
  return response.data;
};


export const addUserAddress = async (formData) => {
  
  const response = await apiClient.post(`/api/user-info/add-user-address`, formData);
  return response.data;
};

export const editUserAddress = async (id, formData) => {
  
  const response = await apiClient.put(`/api/user-info/update-user-address/${id}`, formData);
  return response.data;
};

export const removeUserAddress = async (id) => {
  
  const response = await apiClient.delete(`/api/user-info/delete-user-address/${id}`);
  return response.data;
};