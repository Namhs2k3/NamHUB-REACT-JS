// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ForgotPassword from "./components/Password/ForgotPassword";
import ResetPassword from "./components/Password/ResetPassword";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap"; // Import Bootstrap JS
import AdminStatistic from "./components/AdminComponents/AdminStatistic/AdminStatistic";
import AdminProducts, {
  AddProduct,
  EditProduct,
} from "./components/AdminComponents/AdminProducts/AdminProducts";
import AdminBanner, {
  AddBanner,
  EditBanner,
} from "./components/AdminComponents/AdminBanner/AdminBanner";
import AdminCategory, {
  AddCategory,
  EditCategory,
} from "./components/AdminComponents/AdminCategory/AdminCategory";
import AdminCustomer, {
  AdminCustomerOrderItems,
  AdminCustomerOrders,
} from "./components/AdminComponents/AdminCustomer/AdminCustomer";
import AdminUser from "./components/AdminComponents/AdminUser/AdminUser";
import AdminDiscount, {
  AddDiscount,
  EditDiscount,
} from "./components/AdminComponents/AdminDiscount/AdminDiscount";
import AdminOrder, {
  AdminViewOrderItems,
} from "./components/AdminComponents/AdminOrder/AdminOrder";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToggleSidebarProvider } from "./contexts/ToggleSidebarContext";
import NotFound, { AdminNotFound } from "./components/NotFound/NotFound";
import {
  Unauthenticated,
  Unauthorized,
} from "./components/Unauthorized/Unauth";
import "./main.css";
import "./global.css";
import Profile, {
  AdminProfile,
  CreateProfile,
} from "./components/Profile/Profile";
import OrderList, {
  OrderDetail,
} from "./components/DeliverComponent/OrderList";
import Home from "./components/UserComponent/UserHome/Home";
import UserNavbar from "./components/UserComponent/UserNavBar/UserNavbar"; // Import UserNavbar
import { AddToCartProvider } from "./contexts/AddToCartContext";
import Footer from "./components/UserComponent/UserFooter/Footer";
import ProductDetail from "./components/UserComponent/UserProducts/ProductDetail/ProductDetail";
import Checkout from "./components/UserComponent/Checkout/Checkout";
import { CartAmountProvider } from "./contexts/CartAmountContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailSuccess from "./components/ConfirmEmail/VerifySuccess/EmailSuccess";
import EmailFailure from "./components/ConfirmEmail/VerifyFailure/EmailFailure";
import OrderSuccess from "./components/UserComponent/Checkout/OrderSuccess/OrderSuccess";
import OrderFailure from "./components/UserComponent/Checkout/OrderFailure/OrderFailure";
import OrderTracking from "./components/UserComponent/UserOrders/OrderTracking";
import Products from "./components/UserComponent/UserProducts/Products/Products";
import ProductsByCategory from "./components/UserComponent/UserProducts/ProductByCategory/ProductsByCategory";

export const UserRouters = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <AddToCartProvider>
            <UserNavbar /> {/* Navbar cho các component không phải admin */}
            <Routes>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/verify-email-failure" element={<EmailFailure />} />
              <Route path="/verify-email-success" element={<EmailSuccess />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/order-failure" element={<OrderFailure />} />
              <Route path="/my-orders" element={<OrderTracking />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/products/product-by-category/:cateId/:slug"
                element={<ProductsByCategory />}
              />
              <Route
                path="/checkout"
                element={
                  <CartAmountProvider>
                    <Checkout />
                  </CartAmountProvider>
                }
              />
              <Route
                path="/products/product-detail/:id/:slug"
                element={<ProductDetail />}
              />
              <Route
                path="/input-token-reset-pwd"
                element={<ResetPassword />}
              />
              <Route path="/deliver/order-list" element={<OrderList />} />
              <Route
                path="/deliver/order-details/:orderId"
                element={<OrderDetail />}
              />
              <Route
                path="/customer/profile/create"
                element={<CreateProfile />}
              />
              <Route path="/customer/profile/edit" element={<Profile />} />
              <Route
                path="/administrator/profile/edit"
                element={<AdminProfile />}
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/unauthenticated" element={<Unauthenticated />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Footer></Footer>
          </AddToCartProvider>
        }
      />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes dành cho admin */}
          <Route
            path="/admin/*"
            element={
              <ToggleSidebarProvider>
                <Routes>
                  <Route index element={<AdminStatistic />} />
                  <Route path="statistic" element={<AdminStatistic />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/add-product" element={<AddProduct />} />
                  <Route
                    path="products/edit-product/:slug/:id"
                    element={<EditProduct />}
                  />
                  <Route path="banners" element={<AdminBanner />} />
                  <Route
                    path="banners/edit-banner/:slug/:id"
                    element={<EditBanner />}
                  />
                  <Route path="banners/add-banner" element={<AddBanner />} />
                  <Route path="categories" element={<AdminCategory />} />
                  <Route
                    path="categories/add-category"
                    element={<AddCategory />}
                  />
                  <Route
                    path="categories/edit-category/:slug/:id"
                    element={<EditCategory />}
                  />
                  <Route path="customers" element={<AdminCustomer />} />
                  <Route
                    path="customers/customer-orders/:id"
                    element={<AdminCustomerOrders />}
                  />
                  <Route
                    path="customers/customer-orders/customer-order-items/:id"
                    element={<AdminCustomerOrderItems />}
                  />
                  <Route path="discounts" element={<AdminDiscount />} />
                  <Route
                    path="discounts/edit-discount/:slug/:id"
                    element={<EditDiscount />}
                  />
                  <Route
                    path="discounts/add-discount"
                    element={<AddDiscount />}
                  />
                  <Route path="orders" element={<AdminOrder />} />
                  <Route
                    path="orders/order-details/:id"
                    element={<AdminViewOrderItems />}
                  />
                  <Route path="users" element={<AdminUser />} />
                  <Route path="*" element={<AdminNotFound />} />
                </Routes>
              </ToggleSidebarProvider>
            }
          />

          {/* Routes không phải admin có UserNavbar */}
          <Route path="/*" element={<UserRouters />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
