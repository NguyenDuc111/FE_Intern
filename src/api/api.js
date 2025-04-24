import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/", // sửa lại nếu server chạy port khác
});

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

// === PRODUCT ===
export const getAllProducts = () => API.get("/products");

export const getProductsByCategoryId = (id) =>
  API.get(`/categories/${id}/products`);

export const getAllCategories = () => API.get("/categories");

// === USER PROFILE ===
export const getUserProfile = (userId) => API.get(`/user-profile/${userId}`);
export const updateUserProfile = (userId, data) =>
  API.put(`/update-profile/${userId}`, data);
