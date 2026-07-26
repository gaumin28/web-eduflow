import api from "../lib/api";

// Task notes (Wishlist API):
// - Get, add, and remove favorite courses for current user.

export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (courseId) => api.post(`/wishlist/${courseId}`);
export const removeFromWishlist = (courseId) =>
  api.delete(`/wishlist/${courseId}`);
