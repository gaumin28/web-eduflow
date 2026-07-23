import { Router } from "express";
import refreshToken from "../../controllers/auth/refreshToken.js";

const routerRefreshToken = Router();

routerRefreshToken.post("/refresh-token", refreshToken);

export default routerRefreshToken;