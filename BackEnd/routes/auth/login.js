import { Router } from "express";
import { login } from "../../controllers/auth/login.js";

const routerLogin = Router();

routerLogin.post("/login", login);

export default routerLogin;
