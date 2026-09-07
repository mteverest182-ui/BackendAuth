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

// PUBLIC GET
router.get("/", getBanners);
router.get("/:id", getBannerById);

// ADMIN CREATE
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

// ADMIN UPDATE
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

// ADMIN STATUS
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateBannerStatus,
);

// ADMIN DELETE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteBanner,
);

export default router;