// src/api.js
import axios from "axios";
import apiClient from "./axiosInstance";

const baseURL = import.meta.env.VITE_BACKEND_URL
const token = localStorage.getItem("token");

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
    console.warn("Refresh Token không tồn tại. Chuyển hướng về trang đăng nhập...");
    window.location.href = "/login"; // Hoặc sử dụng `useNavigate` nếu trong một component React
    return; // Kết thúc hàm
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

export const createProd= async (formData) => {
  
  const response = await apiClient.post(`/api/product-manage-for-admin/add-product`,formData,);
  return response.data;
};

// Category 
export const getCategoryList= async (name) => {
  
  const response = await apiClient.get(`/api/categories-manage-for-admin/get-categories-list${name ?`?name=${name}`:""}`, );
  return response.data;
};

export const getCategoryListById= async (id) => {
  
  const response = await apiClient.get(`/api/categories-manage-for-admin/get-categories-list?id=${id}`, );
  return response.data;
};

export const createCate= async (formData) => {
  
  const response = await apiClient.post(`/api/categories-manage-for-admin/add-category`, formData);
  return response.data;
};

export const updateCate= async (id,formData) => {
  
  const response = await apiClient.put(`/api/categories-manage-for-admin/edit-category/${id}`, formData);
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
//Thông Tin Cá Nhân
//Không cần đăng nhập
export const getCustomerInfo = async (id) => {
  
  const response = await apiClient.get(`/api/user-info/get-customer-info${id?`?userIdParam=${id}`:""}`);
  return response.data;
};

export const getUserInfo = async () => {
  
  const response = await apiClient.get(`/api/user-info/get-user-info`);
  return response.data;
};
export const editProfile = async (formData) => {
  
  const response = await apiClient.put(`/api/user-info/update-info`, formData);
  return response.data;
};

export const createProfile = async (formData) => {
  
  const response = await apiClient.post(`/api/user-info/add-info`, formData);
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

//Banner
export const getBannerList = async () => {
  
  const response = await apiClient.get(`/api/BannersManage/get-banner-list-for-admin`);
  return response.data;
};

export const getBannerById = async (id) => {
  
  const response = await apiClient.get(`/api/BannersManage/get-banner-list-for-admin?id=${id}`);
  return response.data;
};

export const updateBanner = async (id, formData) => {
  
  const response = await apiClient.put(`/api/BannersManage/update-banner/${id}`, formData);
  return response.data;
};

export const addBanner = async ( formData) => {
  
  const response = await apiClient.post(`/api/BannersManage/add-banner`, formData);
  return response.data;
};

//Discount
export const getDiscountList = async () => {
  
  const response = await apiClient.get(`/api/DiscountCodes/get-discount-codes`);
  return response.data;
};

export const getDiscountById = async (id) => {
  
  const response = await apiClient.get(`/api/DiscountCodes/get-discount-codes?id=${id}`);
  return response.data;
};

export const updateDiscount = async (id, formData) => {
  
  const response = await apiClient.put(`/api/DiscountCodes/update/${id}`, formData);
  return response.data;
};

export const addDiscount = async ( formData) => {
  
  const response = await apiClient.post(`/api/DiscountCodes/create`, formData);
  return response.data;
};

//Customer Manage

export const getCustomerList = async () => {
  
  const response = await apiClient.get(`/api/customer-manage-for-admin/get-customer-list`);
  return response.data;
};
export const getCustomerOrderList = async (id) => {
  
  const response = await apiClient.get(`/api/customer-manage-for-admin/get-customer-orders-for-admin/${id}`);
  return response.data;
};
export const getCustomerOrderItems = async (id) => {
  
  const response = await apiClient.get(`/api/customer-manage-for-admin/get-customer-order-items-for-admin/${id}`);
  return response.data;
};

//Order Management
export const getOrderList = async (status) => {
  
  const response = await apiClient.get(`/api/orders-manage-for-admin/get-orders-list${status?`?status=${status}`:""}`);
  return response.data;
};

export const getOrderHistory = async (id) => {
  
  const response = await apiClient.get(`/api/orders-manage-for-admin/get-orders-history/${id}`);
  return response.data;
};

export const addNewState = async (id, newStatus) => {
  
  const response = await apiClient.post(`/api/orders-manage-for-admin/add-new-state-for-order-history/${id}`, newStatus,{
      headers: { "Content-Type": "application/json" }, // Gửi chuỗi thuần
    });
  return response.data;
};

//Deliver Order List 
export const getOrderListForDeliver = async () => {
  
  const response = await apiClient.get(`/api/Delivers/get-orders-list-for-deliver`);
  return response.data;
};

export const orderCompleted = async (id) => {
  
  const response = await apiClient.post(`/api/Delivers/delivery-completed/${id}`);
  return response.data;
};

//API for customer
export const getCategoryListForCus = async () => {
  
  const response = await apiClient.get(`/api/Customer/get-categories-list`);
  return response.data;
};

export const getBannerListForCus = async () => {
  
  const response = await apiClient.get(`/api/Customer/get-banner-list`);
  return response.data;
};

export const getDiscountedProductsForCus = async () => {
  
  const response = await apiClient.get(`/api/Customer/get-discounted-foods`);
  return response.data;
};
export const getDiscountCodeForCus = async () => {
  
  const response = await apiClient.get(`/api/Customer/get-active-discount-codes-for-customer`);
  return response.data;
};

export const getPopularProductsForCus = async () => {
  
  const response = await apiClient.get(`/api/Customer/get-popular-foods`);
  return response.data;
};

export const getFoodListForCus = async (name, cateId, productId, page,pageSize) => {
  const params = new URLSearchParams();

  if (name) params.append("searchTerm", name);
  if (cateId) params.append("categoryId", cateId);
  if (productId) params.append("productId", productId);
  if (page) params.append("page", page);
  if (pageSize) params.append("pageSize", pageSize);

  const response = await apiClient.get(`/api/Customer/get-food-list?${params.toString()}`);
  return response.data;
};

export const getCartCount = async () => {
  
  const response = await apiClient.get(`/api/Customer/get-cart-item-count`);
  return response.data;
};

export const getCartItems = async () => {
  
  const response = await apiClient.get(`/api/Customer/get-cus-cart-items`);
  return response.data;
};

export const increaseCartItem = async (id) => {
  
  const response = await apiClient.post(`/api/Customer/increase-quantity?foodId=${id}`);
  return response.data;
};
export const decreaseCartItem = async (id) => {
  
  const response = await apiClient.post(`/api/Customer/decrease-quantity?foodId=${id}`);
  return response.data;
};
export const removeCartItem = async (id) => {
  
  const response = await apiClient.delete(`/api/Customer/delete-cart-item?foodId=${id}`);
  return response.data;
};
export const addToCart = async (id) => {
  const response = await axios.post(
    `${baseURL}/api/Customer/add-to-cart?foodId=${id}`, 
    {}, // Nếu không có body data, truyền vào một object rỗng
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


//Đánh giá sản phẩm

export const createReview = (data) => {
  return axios.post(`${baseURL}/api/Customer/create-comment`, data , {
    headers:{
      Authorization: `Bearer ${token}`,
      "Content-Type":"application/json"
    }
  });
};

export const updateReview = ( data) => {
  return axios.put(`${baseURL}/api/Customer/update-comment`, data , {
    headers:{
      Authorization: `Bearer ${token}`,
      "Content-Type":"application/json"
    }
  });
};

export const deleteReview = (commentId) => {
  return axios.delete(`${baseURL}/api/Customer/delete-comment/${commentId}` , {
    headers:{
      Authorization: `Bearer ${token}`,
      "Content-Type":"application/json"
    }
  });
};

// Checkout
export const checkout = async (data) => {
  
  const response = await apiClient.post(`/api/Payment/checkout`, data);
  return response.data;
};