import bcrypt, { compare } from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../utils/prisma.js"

export const jwSecret = process.env.JWTSECRET;

export const LoginUser = async(req, res) => {
  try{
    const {username, password } = req.body;

    if (!username || password) {
      return res.status(400).json({
        message: "username dan password wajib di isi",
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      }
    });

    if(!existingUser){
      return res.status(400).json({
        message:"username belum terdaftar",
      });
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if(!comparePassword){
      return res.status(400).json({
        message: "username atau password salah",
      })
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        role: existingUser.role,
      },
      jwSecret,
      {
        expiresIn: "6d",
      },
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 6 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Berhasil",
      data: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  }catch (error){
    console.error("Login Error:", error);

    return res,status(500).json({
      message: "Server Down",
      error: error.message,
    });
  }
};

export const GetUser = async (req, res) => {
  return res.status(200).json({
    message: "Berhasil Get User",
    data: req.user,
  });
};

export const LogoutUser = async (req, res) => {
  try {
    
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      message: "Server Down",
      error: error.message,
    });
  }
};

















// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { prisma } from "../utils/prisma.js";

// export const jwtSecret = process.env.JWTSECRET;

// export const LoginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({
//         message: "Username dan password wajib diisi",
//       });
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: {
//         username,
//       },
//     });

//     if (!existingUser) {
//       return res.status(400).json({
//         message: "Username belum terdaftar",
//       });
//     }

//     const comparePassword = await bcrypt.compare(
//       password,
//       existingUser.password,
//     );

//     if (!comparePassword) {
//       return res.status(400).json({
//         message: "Username atau password salah",
//       });
//     }

//     // =========================
//     // JWT
//     // =========================

//     const token = jwt.sign(
//       {
//         id: existingUser.id,
//         role: existingUser.role,
//       },
//       jwtSecret,
//       {
//         expiresIn: "6d",
//       },
//     );

//     // =========================
//     // COOKIE
//     // =========================

//     res.cookie("access_token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 6 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       message: "Login Berhasil",
//       data: {
//         id: existingUser.id,
//         username: existingUser.username,
//         email: existingUser.email,
//         role: existingUser.role,
//       },
//     });
//   } catch (error) {
//     console.error("LOGIN ERROR:", error);

//     return res.status(500).json({
//       message: "Server Down",
//       error: error.message,
//     });
//   }
// };

// export const GetUser = async (req, res) => {
//   return res.status(200).json({
//     message: "Berhasil Get User",
//     data: req.user,
//   });
// };

// export const LogoutUser = async (req, res) => {
//   try {
//     res.clearCookie("access_token", {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//     });

//     return res.status(200).json({
//       message: "Logout Berhasil",
//     });
//   } catch (error) {
//     console.error("LOGOUT ERROR:", error);

//     return res.status(500).json({
//       message: "Server Down",
//       error: error.message,
//     });
//   }
// };