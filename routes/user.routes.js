import express from "express";

import {
  createAdmin,
  updateAdmin,
  getUsers,
  deleteAdmin,
} from "../controller/user.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUsers,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createAdmin,
);

router.patch(
  "/roles/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateAdmin,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteAdmin,
);

export default router;