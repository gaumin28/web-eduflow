import api from "../lib/api";

// Task notes (Cart/Checkout API):
// - CRUD cart items and clear cart.
// - Submit checkout payload from checkout page.

export const getCart = () => api.get("/cart");

export const addCartItem = (courseId) =>
  api.post("/cart/items", {
    courseId,
  });

export const removeCartItem = (courseId) =>
  api.delete(`/cart/items/${courseId}`);

export const clearCartApi = () => api.delete("/cart");

export const checkoutCart = (payload) => api.post("/checkout", payload);
