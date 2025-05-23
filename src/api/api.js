import axios from "axios";

const API = axios.create({
  baseURL: "http://tmdt1.cholimexfood.com.vn/api/",
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
export const forgotPassword = (data) =>
  API.post("/forgot-password", {
    Email: data.email,
  });

export const resetPassword = (data) =>
  API.post("/reset-password", {
    Token: data.token,
    NewPassword: data.newPassword,
  });

export const changePassword = (data, token) =>
  API.post("/change-password", data, {
    headers: { Authorization: `Bearer ${token}` },
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
export const getOrderByIdUser = (token, Id) =>
  API.get(`/order-user/${Id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
// === ORDER ADMIN ===
export const deleteOrder = (id) =>
  API.delete(`/order-del/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const updateOrder = (id, data) =>
  API.put(`/order-update/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
export const getOrdersByUserId = (userId, token) =>
  API.get(`/orders-all/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
// === LOYALTY POINTS ===
export const getLoyaltyPointsAPI = (token) =>
  API.get("/point", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getUserPointsByAdmin = (token, userId) =>
  API.get(`/point/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
// === LOYALTY POINTS ADMIN ===
export const updateLoyaltyPoint = (id, data, token) =>
  API.put(`/point-edit/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteLoyaltyPoint = (id, token) =>
  API.delete(`/point-del/${id}`, {
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
// === NOTIFICATION ===
export const getNotifications = (token) =>
  API.get("/noti", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const markNotificationAsRead = (id, token) =>
  API.post(`/noti/read/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createNotification = (data, token) =>
  API.post("/noti-add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteNotification = (id, token) =>
  API.delete(`/noti-del/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllNotifications = (token) =>
  API.get("/noti-all", {
    headers: { Authorization: `Bearer ${token}` },
  });

// === PRODUCT ADMIN ===
export const addProduct = (data) =>
  API.post("/product-add", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).catch((error) => {
    console.error("Error details:", error.response?.data); // Log chi tiết lỗi từ server
    throw error;
  });

export const updateProduct = (id, data) =>
  API.put(`/product-update/${id}`, data);

export const deleteProduct = (id) => API.delete(`/product-del/${id}`);
// === REVIEW ===
export const getReviewsByProduct = (id) => API.get(`/review/product/${id}`);

export const createReview = (data, token) =>
  API.post("/review-add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// === VOUCHERS ===
export const getAvailableVouchers = (token) =>
  API.get("/vouchers", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const redeemVoucher = (data) => API.post("/redeem-voucher", data);

export const applyVoucher = (data, token) =>
  API.post("/apply-voucher", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getRedeemedVouchers = (token) =>
  API.get("/redeemed", {
    headers: { Authorization: `Bearer ${token}` },
  });

// === USER ADMIN ===
export const getAllUsers = () => API.get("/user-all");

export const updateUser = (id, data) => API.put(`/update-profile/${id}`, data);

export const deleteUser = (id) => API.delete(`/delete-user/${id}`);

export const getRevenueStatistics = () => API.get("/static");

// === VOUCHER ADMIN ===
export const getAllVouchers = (token) =>
  API.get("/vouchers", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addVoucher = (data, token) =>
  API.post("/vouchers", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const editVoucher = (voucherId, data, token) =>
  API.put(`/vouchers/${voucherId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteVoucher = (voucherId, token) =>
  API.delete(`/vouchers/${voucherId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// === REVIEW ADMIN ===
export const getAllReviews = () => API.get("/review-all");

export const updateReview = (id, data) => API.put(`/review-update/${id}`, data);

export const deleteReview = (id) => API.delete(`/review-delete/${id}`);
