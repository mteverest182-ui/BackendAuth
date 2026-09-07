import express from "express";
import { getWhatsappSetting, updateWhatsappSetting,deleteWhatsappSetting, getDashboardStats } from "../controller/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

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