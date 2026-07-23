import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRole.js";
import {
  getDashboardStats,
  getRevenueChart,
  getDashboardTables,
} from "../controllers/dashboard.js";

const dashboardRouter = Router();
const adminOnly = [authMiddleware, authorizeRole("admin")];

dashboardRouter.get("/admin/dashboard/stats", adminOnly, getDashboardStats);
dashboardRouter.get("/admin/dashboard/revenue-chart", adminOnly, getRevenueChart);
dashboardRouter.get("/admin/dashboard/tables", adminOnly, getDashboardTables);

export default dashboardRouter;
