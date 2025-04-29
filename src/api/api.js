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

export const getProductById = (id) => API.get(`/product/${id}`);

// === CART
// Thêm sản phẩm vào giỏ hàng
export const addToCartAPI = (data, token) =>
  API.post("/cart-add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getCartAPI = (token) =>
  API.get("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCartAPI = (Id, quantity, token) =>
  API.put(
    `/cart-edit/${Id}`,
    { Quantity: quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const removeCartItemAPI = (cartId, token) =>
  API.delete(`/del/${cartId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });



// === USER PROFILE ===
export const getUserProfile = (userId) => API.get(`/user-profile/${userId}`);
export const updateUserProfile = (userId, data) =>
  API.put(`/update-profile/${userId}`, data);

// === WISHLIST ===

export const getWishlistAPI = (token) =>
  API.get("/wishlist-all", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToWishlistAPI = (data, token) =>
  API.post("/wishlist-add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const removeFromWishlistAPI = (productId, token) =>
  API.delete(`/wishlist-del/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });