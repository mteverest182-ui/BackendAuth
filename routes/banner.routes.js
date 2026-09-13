import express from "express";

import {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  updateBannerStatus,
  deleteBanner,
} from "../controller/banner.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getBanners);
router.get("/:id", getBannerById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  uploadImage.fields([
    { name: "desktop", maxCount: 1 },
    { name: "mobile", maxCount: 1 },
  ]),
  createBanner,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  uploadImage.fields([
    { name: "desktop", maxCount: 1 },
    { name: "mobile", maxCount: 1 },
  ]),
  updateBanner,
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateBannerStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteBanner,
);

export default router;