import api from "../lib/api";

export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (courseId) => api.post(`/wishlist/${courseId}`);
export const removeFromWishlist = (courseId) =>
  api.delete(`/wishlist/${courseId}`);
