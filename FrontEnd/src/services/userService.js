import api from "../lib/api";

export const getMyPurchasedCourses = () => api.get("/orders/my-courses");
export const getMyRecentOrders = () => api.get("/orders/recent");
export const getMyAllOrders = () => api.get("/orders");
export const getMyOrderDetail = (orderId) => api.get(`/orders/${orderId}`);

export const changePassword = (currentPassword, newPassword, confirmPassword) =>
  api.put("/users/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });

export const updateAvatar = (formData) =>
  api.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getProfile = () => api.get("/users/me");
