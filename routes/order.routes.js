import express from "express";

import {
  getOrderSetting,
} from "../controller/order.controller.js";

const router = express.Router();

router.get(
  "/setting",
  getOrderSetting,
);

export default router;