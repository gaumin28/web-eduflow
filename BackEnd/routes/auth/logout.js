import { Router } from "express";
import { logoutUser } from "../../controllers/auth/logout.js";

const routerLogout = Router();

routerLogout.post("/logout", logoutUser);

export default routerLogout;
