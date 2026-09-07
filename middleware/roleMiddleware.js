import { success } from "zod"

export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req.user){
      return res.status(401).json({
        success: false,
        message: "Authentication Diperlukan",
      });
    }

    if(!allowedRoles.includes(req.user.role)){
      return res.status(403).json({
        success:false,
        message:"Anda Tidak Memiliki akses",
      });
    }

    next();
  }
}