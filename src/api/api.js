// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/", // sửa nếu server chạy port khác
});

// ✅ Gắn token vào tất cả request nếu có
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === AUTH ===
export const login = (data) =>
  API.post("/login", {
    Email: data.email,
    Password: data.password,
  });

export const register = (data) =>
  API.post("/signup", {
    FullName: data.name,
    Email: data.email,
    Password: data.password,
    Phone: data.phone,
    Address: data.address,
  });

// === PROTECTED (cần token) ===
export const changePassword = (data) =>
  API.post("/change-password", {
    OldPassword: data.oldPassword,
    NewPassword: data.newPassword,
  });

export const forgotPassword = (email) =>
  API.post("/forgot-password", { Email: email });

// === PRODUCT


export const getAllProducts = () => API.get('/products');


// ==== USERPROFILE

// Lấy thông tin người dùng
export const getUserProfile = (userId) => API.get(`/user-profile/${userId}`);

// Cập nhật thông tin người dùng
export const updateUserProfile = (userId, data) => API.put(`/update-profile/${userId}`, data);

