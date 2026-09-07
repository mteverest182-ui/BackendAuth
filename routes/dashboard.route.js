import express from "express";
import { getWhatsappSetting, updateWhatsappSetting,deleteWhatsappSetting, getDashboardStats } from "../controller/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getDashboardStats
);

router.get("/whatsapp", getWhatsappSetting);
router.put("/whatsapp", authMiddleware,roleMiddleware("ADMIN"), updateWhatsappSetting);

router.delete(
  "/whatsapp",
  authMiddleware,
  roleMiddleware("ADMIN",),
  deleteWhatsappSetting
);

export default router;
