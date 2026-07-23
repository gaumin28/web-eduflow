import express from "express";
import { getAdminNotifications, getUserNotifications, markAllAsRead, markAllAsReadUser, markNotificationAsRead, markNotificationAsReadUser } from "../controllers/notification.js";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRole.js";

const routerNotification = Router();

routerNotification.get("/admin/notifications", authMiddleware, authorizeRole("admin"), getAdminNotifications);
routerNotification.get("/notifications", authMiddleware, getUserNotifications);
routerNotification.patch("/admin/notifications/read-all", authMiddleware, authorizeRole("admin"), markAllAsRead);
routerNotification.patch("/admin/notifications/:id/read", authMiddleware, authorizeRole("admin"), markNotificationAsRead);
routerNotification.patch("/notifications/user/read-all", authMiddleware, authorizeRole("customer"), markAllAsReadUser);
routerNotification.patch("/notifications/:id/read", authMiddleware, authorizeRole("customer"), markNotificationAsReadUser);
export default routerNotification;