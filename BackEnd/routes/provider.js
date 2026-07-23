import { Router } from "express";
import {
  getProviders,
  getProviderCourses,
  seedProviderCourses,
  createProvider,
  getAdminRequestProviders,
  getAdminRequestProvidersDetail,
  updateProviderStatus,
  rejectProviderRequest,
  getMyProviderRequest,
} from "../controllers/provider.js";

import authMiddleware  from "../middleware/authMiddleware.js";
import { uploadProviderFiles } from "../middleware/upload.js";
import authorizeRole  from "../middleware/authorizeRole.js";

const routerProvider = Router();

routerProvider.get("/providers", getProviders);
routerProvider.get("/providers/:providerId/courses", getProviderCourses);
routerProvider.post("/providers/:providerId/courses/seed", seedProviderCourses);
routerProvider.get(
  "/providers-requests", 
  authMiddleware, 
  authorizeRole("admin"),
  getAdminRequestProviders
);
routerProvider.get(
  "/providers-requests/:providerId", 
  authMiddleware,
  authorizeRole("admin"),
  getAdminRequestProvidersDetail 
);
routerProvider.get(
  "/provider/my-request", 
  authMiddleware,
  authorizeRole("customer"),
  getMyProviderRequest
);
routerProvider.post(
  "/provider/register", 
  authMiddleware, 
  authorizeRole("customer"), 
  uploadProviderFiles,
  createProvider
);
routerProvider.patch(
  "/provider/:providerId/status", 
  authMiddleware, 
  authorizeRole("admin"), 
  updateProviderStatus
);

routerProvider.patch(
  "/providers/:providerId/reject", 
  authMiddleware, 
  authorizeRole("admin"), 
  rejectProviderRequest
);

export default routerProvider;
