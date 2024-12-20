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
import AdminOrder from "./components/AdminComponents/AdminOrder/AdminOrder";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToggleSidebarProvider } from "./contexts/ToggleSidebarContext";
import NotFound from "./components/NotFound/NotFound";
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/input-token-reset-pwd" element={<ResetPassword />} />
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
                  <Route path="users" element={<AdminUser />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ToggleSidebarProvider>
            }
          />
          <Route path="/customer/profile/create" element={<CreateProfile />} />
          <Route path="/customer/profile/edit" element={<Profile />} />
          <Route path="/admin/profile/edit" element={<AdminProfile />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/unauthenticated" element={<Unauthenticated />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
