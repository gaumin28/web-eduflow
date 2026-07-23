import { Router } from "express";
import { forgotPassword, resetPassword, verifyOtp } from "../../controllers/auth/forgotPassword.js";


const routerForgotPassword = Router();

routerForgotPassword.post(
  "/forgot-password",
  forgotPassword,
);
routerForgotPassword.post(
  "/verify-otp",
  verifyOtp,
);
routerForgotPassword.post(
  "/reset-password",
  resetPassword,
);

export default routerForgotPassword;
