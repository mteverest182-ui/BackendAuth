import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";
import { jwtSecret } from "../controller/auth.controller.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication diperlukan",
      });
    }

    const decoded = jwt.verify(token, jwtSecret);

    const currentUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User tidak valid",
      });
    }

    req.user = {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Token tidak valid",
    });
  }
};