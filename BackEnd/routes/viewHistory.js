import { Router } from "express";
import { recordView, getRecentlyViewed } from "../controllers/viewHistory.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRole.js";

const routerViewHistory = Router();

routerViewHistory.post("/view-history", authMiddleware, authorizeRole("customer"), recordView);
routerViewHistory.get("/view-history", authMiddleware, authorizeRole("customer"), getRecentlyViewed);

export default routerViewHistory;
