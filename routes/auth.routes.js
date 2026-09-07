import { Router } from "express";
import {
  GetUser,
  LoginUser,
  LogoutUser,
} from "../controller/auth.controller.js";
import "dotenv/config";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signin", LoginUser);
router.get("/user", authMiddleware, GetUser);
router.post("/logout", LogoutUser);

export default router;
