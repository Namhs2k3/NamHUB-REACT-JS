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
import AdminProducts from "./components/AdminComponents/AdminProducts/AdminProducts";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToggleSidebarProvider } from "./contexts/ToggleSidebarContext";
import NotFound from "./components/NotFound/NotFound";
import {
  Unauthenticated,
  Unauthorized,
} from "./components/Unauthorized/Unauth";
import "./main.css";

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
                </Routes>
              </ToggleSidebarProvider>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/unauthenticated" element={<Unauthenticated />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
