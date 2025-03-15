import { Router } from "express";
import {
  signUp,
  login,
  logout,
  refresh,
  verifyUser,
} from "../controllers/user.controllers.js";

import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

//routes
//not-secure-routes
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/refresh").post(refresh);

//secure-routes
router.route("/logout").post(verifyToken, logout);
router.route("/check").get(verifyToken, verifyUser);

export default router;
