import { Router } from "express";
import {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
} from "../controllers/category.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRole.js";

const categoryRouter = Router();

// ── Public routes ──────────────────────────────────────────
categoryRouter.get("/category", getCategories);
categoryRouter.get("/categories", getCategories);

// ── Admin routes (auth + role guard) ───────────────────────
categoryRouter.get(
  "/admin/categories",
  authMiddleware,
  authorizeRole("admin"),
  getAdminCategories,
);

categoryRouter.post(
  "/admin/categories",
  authMiddleware,
  authorizeRole("admin"),
  createCategory,
);

categoryRouter.put(
  "/admin/categories/:id",
  authMiddleware,
  authorizeRole("admin"),
  updateCategory,
);

categoryRouter.delete(
  "/admin/categories/:id",
  authMiddleware,
  authorizeRole("admin"),
  deleteCategory,
);

categoryRouter.patch(
  "/admin/categories/:id/status",
  authMiddleware,
  authorizeRole("admin"),
  updateCategoryStatus,
);

export default categoryRouter;
