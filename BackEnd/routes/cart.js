import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRole.js";
import {
  addCartItem,
  checkout,
  clearCart,
  getAdminOrders,
  getCart,
  getMyAllOrders,
  getMyOrderById,
  getMyPurchasedCourses,
  getMyRecentOrders,
  removeCartItem,
} from "../controllers/cart.js";

const routerCart = Router();
const customerOnly = [authMiddleware, authorizeRole("customer")];
const adminOnly = [authMiddleware, authorizeRole("admin")];

routerCart.get("/cart", customerOnly, getCart);
routerCart.get("/orders/my-courses", customerOnly, getMyPurchasedCourses);
routerCart.get("/orders/recent", customerOnly, getMyRecentOrders);
routerCart.get("/orders", customerOnly, getMyAllOrders);
routerCart.get("/orders/:orderId", customerOnly, getMyOrderById);
routerCart.post("/cart/items", customerOnly, addCartItem);
routerCart.delete("/cart/items/:courseId", customerOnly, removeCartItem);
routerCart.delete("/cart", customerOnly, clearCart);
routerCart.post("/checkout", customerOnly, checkout);

// Admin order management
routerCart.get("/admin/orders", adminOnly, getAdminOrders);

export default routerCart;
