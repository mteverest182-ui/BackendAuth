import express from "express";

import {
  getProductsByCategoryID,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getProductsByCategoryID);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCategory,
);

router.get(
  "/:categoryId/products",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getProductsByCategoryID,
);

router.get("/:categoryId/products", getProductsByCategoryID);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCategory,
);

export default router;
