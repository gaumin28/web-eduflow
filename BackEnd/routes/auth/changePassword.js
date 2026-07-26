import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { changePassword } from "../../controllers/auth/changePassword.js";

// Task notes (Account security API):
// - Authenticated endpoint used by ChangePasswordPage.
// - Forces password update flow on current logged-in user.

const routerChangePassword = Router();

routerChangePassword.put(
  "/users/change-password",
  authMiddleware,
  changePassword,
);

export default routerChangePassword;
