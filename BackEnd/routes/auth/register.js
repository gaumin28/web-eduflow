import { Router } from "express";
import { register } from "../../controllers/auth/register.js";

const routerRegister = Router();

routerRegister.post("/register", register);

export default routerRegister;
