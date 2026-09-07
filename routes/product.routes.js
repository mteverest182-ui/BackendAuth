import express from "express";
import {
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductsById);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  uploadImage.single("image"),
  createProduct,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  uploadImage.single("image"),
  updateProduct,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteProduct,
);

export default router;
