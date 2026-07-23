import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { changePassword } from "../../controllers/auth/changePassword.js";

const routerChangePassword = Router();

routerChangePassword.put(
  "/users/change-password",
  authMiddleware,
  changePassword,
);

export default routerChangePassword;
