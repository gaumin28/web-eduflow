import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/user.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRole.js";

const routerUser = Router();
const adminOnly = [authMiddleware, authorizeRole("admin")];
const customerOnly = [authMiddleware, authorizeRole("customer")];

routerUser.post("/users", createUser);
routerUser.get("/users", adminOnly, getAllUsers);
routerUser.get("/users/:id", adminOnly, getUserById);
routerUser.patch("/users/:id/status", adminOnly, updateUserStatus);

// Wishlist
routerUser.get("/wishlist", customerOnly, getWishlist);
routerUser.post("/wishlist/:courseId", customerOnly, addToWishlist);
routerUser.delete("/wishlist/:courseId", customerOnly, removeFromWishlist);

export default routerUser;
