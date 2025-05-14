import { Router } from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser as any);
router.route("/me").get(authMiddleware as any, currentUser as any);
router.route("/logout").post(authMiddleware as any, logoutUser as any);

export default router;
