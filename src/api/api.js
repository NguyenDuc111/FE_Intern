import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/",
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

// === CART ===
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

// === ORDER ===
export const createOrderAPI = (data, token) =>
  API.post("/order-add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const processPaymentAPI = (data, token) =>
  API.post("/payment", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllOrders = (token) =>
  API.get("/order", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOrderById = (token, Id) =>
  API.get(`/order/${Id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// === LOYALTY POINTS ===
export const getLoyaltyPointsAPI = (token) =>
  API.get("/point", {
    headers: { Authorization: `Bearer ${token}` },
  });

// === USER PROFILE ===
export const getUserProfile = (userId, token) =>
  API.get(`/user-profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

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
