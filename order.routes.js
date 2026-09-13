[1mdiff --git a/config/cloudinary.js b/config/cloudinary.js[m
[1mindex ef6867f..6a49d36 100644[m
[1m--- a/config/cloudinary.js[m
[1m+++ b/config/cloudinary.js[m
[36m@@ -7,10 +7,4 @@[m [mcloudinary.config({[m
   api_secret: process.env.CLOUDINARY_API_SECRET,[m
 });[m
 [m
[31m-console.log("CLOUDINARY CONFIG:", {[m
[31m-  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,[m
[31m-  api_key: process.env.CLOUDINARY_API_KEY,[m
[31m-  has_api_secret: Boolean(process.env.CLOUDINARY_API_SECRET),[m
[31m-});[m
[31m-[m
 export default cloudinary;[m
[1mdiff --git a/controller/banner.controller.js b/controller/banner.controller.js[m
[1mindex 8d2f2d3..9ff8e0b 100644[m
[1m--- a/controller/banner.controller.js[m
[1m+++ b/controller/banner.controller.js[m
[36m@@ -83,15 +83,6 @@[m [mconst validateBannerFiles = async ([m
         files || {},[m
     );[m
 [m
[31m-    console.log("VALIDATE FILES:", {[m
[31m-        required,[m
[31m-        files: files[m
[31m-            ? Object.keys(files)[m
[31m-            : [],[m
[31m-        fileEntriesLength:[m
[31m-            fileEntries.length,[m
[31m-    });[m
[31m-[m
     if ([m
         required &&[m
         fileEntries.length === 0[m
[36m@@ -189,20 +180,6 @@[m [mexport const createBanner = async ([m
             sortOrder = 0,[m
         } = req.body;[m
 [m
[31m-        console.log([m
[31m-            "CREATE BANNER DATA:",[m
[31m-            {[m
[31m-                title,[m
[31m-                description,[m
[31m-                slotKey,[m
[31m-                status,[m
[31m-                linkUrl,[m
[31m-                startAt,[m
[31m-                endAt,[m
[31m-                sortOrder,[m
[31m-            },[m
[31m-        );[m
[31m-[m
         /*[m
          * =========================[m
          * TITLE[m
[36m@@ -365,38 +342,6 @@[m [mexport const createBanner = async ([m
                 },[m
             });[m
 [m
[31m-        /*[m
[31m-         * =========================[m
[31m-         * DEBUG UPLOAD[m
[31m-         * =========================[m
[31m-         */[m
[31m-[m
[31m-        console.log([m
[31m-            "========== BEFORE UPLOAD ==========",[m
[31m-        );[m
[31m-[m
[31m-        console.log([m
[31m-            "BANNER ID:",[m
[31m-            banner.id,[m
[31m-        );[m
[31m-[m
[31m-        console.log([m
[31m-            "FILES:",[m
[31m-            files,[m
[31m-        );[m
[31m-[m
[31m-        console.log([m
[31m-            "DESKTOP:",[m
[31m-            files.desktop?.[0][m
[31m-                ?.originalname,[m
[31m-        );[m
[31m-[m
[31m-        console.log([m
[31m-            "MOBILE:",[m
[31m-            files.mobile?.[0][m
[31m-                ?.originalname,[m
[31m-        );[m
[31m-[m
         /*[m
          * =========================[m
          * UPLOAD IMAGES[m
[36m@@ -409,15 +354,6 @@[m [mexport const createBanner = async ([m
                 banner.id,[m
             );[m
 [m
[31m-        console.log([m
[31m-            "========== AFTER UPLOAD ==========",[m
[31m-        );[m
[31m-[m
[31m-        console.log([m
[31m-            "UPLOADED IMAGES:",[m
[31m-            uploadedImages,[m
[31m-        );[m
[31m-[m
         /*[m
          * =========================[m
          * SAVE IMAGES[m
[36m@@ -641,17 +577,6 @@[m [mexport const getBanners = async ([m
                 ],[m
             });[m
 [m
[31m-        console.log([m
[31m-            "BANNERS FROM DATABASE:",[m
[31m-            banners.map((banner) => ({[m
[31m-                id: banner.id,[m
[31m-                title: banner.title,[m
[31m-                slotKey: banner.slotKey,[m
[31m-                status: banner.status,[m
[31m-                images: banner.images,[m
[31m-            })),[m
[31m-        );[m
[31m-[m
         return res.status(200).json({[m
             message:[m
                 "Banner berhasil diambil",[m
[1mdiff --git a/controller/dashboard.controller.js b/controller/dashboard.controller.js[m
[1mindex bbede5c..d46459d 100644[m
[1m--- a/controller/dashboard.controller.js[m
[1m+++ b/controller/dashboard.controller.js[m
[36m@@ -1,4 +1,3 @@[m
[31m-import { success } from "zod";[m
 import { prisma } from "../utils/prisma.js";[m
 [m
 export const getDashboardStats = async (req, res) => {[m
[36m@@ -29,68 +28,132 @@[m [mexport const getDashboardStats = async (req, res) => {[m
   }[m
 };[m
 [m
[31m-export const getWhatsappSetting = async (req, res) => {[m
[31m-    try {[m
[31m-        const setting = await prisma.appSetting.findFirst();[m
[32m+[m[32mexport const getWhatsappSetting = async ([m
[32m+[m[32m  req,[m
[32m+[m[32m  res,[m
[32m+[m[32m) => {[m
[32m+[m[32m  try {[m
[32m+[m[32m    const setting =[m
[32m+[m[32m      await prisma.appSetting.findFirst();[m
 [m
[31m-        return res.status(200).json({[m
[31m-            success: true,[m
[31m-            data: {[m
[31m-                whatsappUrl: setting?.whatsappUrl ?? "",[m
[31m-            },[m
[31m-        });[m
[31m-    }catch(error){[m
[31m-        console.error("Get whatsapp Setting Error", error);[m
[32m+[m[32m    const whatsappUrl =[m
[32m+[m[32m      setting?.whatsappUrl ?? "";[m
 [m
[31m-        return res.status(500).json({[m
[31m-            success: false,[m
[31m-            message:"Gagal Mengambil Whatsapp URL",[m
[31m-        });[m
[31m-    }[m
[32m+[m[32m    return res.status(200).json({[m
[32m+[m[32m      success: true,[m
[32m+[m[32m      data: {[m
[32m+[m[32m        whatsappUrl,[m
[32m+[m[32m      },[m
[32m+[m[32m    });[m
[32m+[m[32m  } catch (error) {[m
[32m+[m[32m    console.error([m
[32m+[m[32m      "GET WHATSAPP SETTING ERROR:",[m
[32m+[m[32m      error,[m
[32m+[m[32m    );[m
[32m+[m
[32m+[m[32m    return res.status(500).json({[m
[32m+[m[32m      success: false,[m
[32m+[m[32m      message:[m
[32m+[m[32m        "Gagal mengambil WhatsApp URL",[m
[32m+[m[32m    });[m
[32m+[m[32m  }[m
 };[m
 [m
[31m-export const updateWhatsappSetting = async(req, res) => {[m
[31m-    try { [m
[31m-        const { whatsappUrl} = req.body;[m
[32m+[m[32mexport const updateWhatsappSetting = async ([m
[32m+[m[32m  req,[m
[32m+[m[32m  res,[m
[32m+[m[32m) => {[m
[32m+[m[32m  try {[m
[32m+[m[32m    const { whatsappUrl } = req.body;[m
[32m+[m
[32m+[m[32m    const url = String([m
[32m+[m[32m      whatsappUrl || "",[m
[32m+[m[32m    ).trim();[m
[32m+[m
[32m+[m[32m    if (!url) {[m
[32m+[m[32m      return res.status(400).json({[m
[32m+[m[32m        success: false,[m
[32m+[m[32m        message: "URL wajib diisi",[m
[32m+[m[32m      });[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    let parsed;[m
[32m+[m
[32m+[m[32m    try {[m
[32m+[m[32m      parsed = new URL(url);[m
[32m+[m[32m    } catch {[m
[32m+[m[32m      return res.status(400).json({[m
[32m+[m[32m        success: false,[m
[32m+[m[32m        message:[m
[32m+[m[32m          "Format URL tidak valid",[m
[32m+[m[32m      });[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    if ([m
[32m+[m[32m      !["http:", "https:"].includes([m
[32m+[m[32m        parsed.protocol,[m
[32m+[m[32m      )[m
[32m+[m[32m    ) {[m
[32m+[m[32m      return res.status(400).json({[m
[32m+[m[32m        success: false,[m
[32m+[m[32m        message:[m
[32m+[m[32m          "URL harus menggunakan HTTP atau HTTPS",[m
[32m+[m[32m      });[m
[32m+[m[32m    }[m
 [m
[31m-        const existing = await prisma.appSetting.findFirst();[m
[32m+[m[32m    const existing =[m
[32m+[m[32m      await prisma.appSetting.findFirst();[m
 [m
[31m-        const setting = existing ? await prisma.appSetting.update({[m
[31m-            where: {[m
[31m-                id: existing.id,[m
[31m-            },[m
[31m-            data: {[m
[31m-                whatsappUrl[m
[31m-            },[m
[32m+[m[32m    const setting = existing[m
[32m+[m[32m      ? await prisma.appSetting.update({[m
[32m+[m[32m          where: {[m
[32m+[m[32m            id: existing.id,[m
[32m+[m[32m          },[m
[32m+[m[32m          data: {[m
[32m+[m[32m            whatsappUrl: url,[m
[32m+[m[32m          },[m
         })[m
[31m-        : await prisma.appSetting.create({[m
[31m-            data: {[m
[31m-                whatsappUrl,[m
[31m-            },[m
[31m-        });[m
[31m-        return res.status(200).json({[m
[31m-            success: true,[m
[31m-            message: "Whatsapp Url Berhasil disimpan",[m
[31m-            data: setting,[m
[32m+[m[32m      : await prisma.appSetting.create({[m
[32m+[m[32m          data: {[m
[32m+[m[32m            whatsappUrl: url,[m
[32m+[m[32m          },[m
         });[m
[31m-    }catch(error){[m
[31m-        console.error("UPDATE WHATSAPP SETTING ERROR:", error);[m
 [m
[31m-        return res.status(500).json({[m
[31m-            success: false,[m
[31m-            message: "Gagal menyimpan whatsapp URL",[m
[31m-        });[m
[31m-    }[m
[32m+[m[32m    return res.status(200).json({[m
[32m+[m[32m      success: true,[m
[32m+[m[32m      message:[m
[32m+[m[32m        "Order URL berhasil disimpan",[m
[32m+[m[32m      data: {[m
[32m+[m[32m        ...setting,[m
[32m+[m[32m      },[m
[32m+[m[32m    });[m
[32m+[m[32m  } catch (error) {[m
[32m+[m[32m    console.error([m
[32m+[m[32m      "UPDATE WHATSAPP SETTING ERROR:",[m
[32m+[m[32m      error,[m
[32m+[m[32m    );[m
[32m+[m
[32m+[m[32m    return res.status(500).json({[m
[32m+[m[32m      success: false,[m
[32m+[m[32m      message:[m
[32m+[m[32m        "Gagal menyimpan WhatsApp URL",[m
[32m+[m[32m    });[m
[32m+[m[32m  }[m
 };[m
 [m
[31m-export const deleteWhatsappSetting = async (req, res) => {[m
[32m+[m[32mexport const deleteWhatsappSetting = async ([m
[32m+[m[32m  req,[m
[32m+[m[32m  res,[m
[32m+[m[32m) => {[m
   try {[m
[31m-    const setting = await prisma.appSetting.findFirst();[m
[32m+[m[32m    const setting =[m
[32m+[m[32m      await prisma.appSetting.findFirst();[m
 [m
     if (!setting) {[m
       return res.status(404).json({[m
         success: false,[m
[31m-        message: "WhatsApp URL belum tersedia",[m
[32m+[m[32m        message:[m
[32m+[m[32m          "WhatsApp URL belum tersedia",[m
       });[m
     }[m
 [m
[36m@@ -102,14 +165,23 @@[m [mexport const deleteWhatsappSetting = async (req, res) => {[m
 [m
     return res.status(200).json({[m
       success: true,[m
[31m-      message: "WhatsApp URL berhasil dihapus",[m
[32m+[m[32m      message:[m
[32m+[m[32m        "Order URL berhasil dihapus",[m
[32m+[m[32m      data: {[m
[32m+[m[32m        whatsappUrl: "",[m
[32m+[m[32m        orderChannel: null,[m
[32m+[m[32m      },[m
     });[m
   } catch (error) {[m
[31m-    console.error("DELETE WHATSAPP SETTING ERROR:", error);[m
[32m+[m[32m    console.error([m
[32m+[m[32m      "DELETE WHATSAPP SETTING ERROR:",[m
[32m+[m[32m      error,[m
[32m+[m[32m    );[m
 [m
     return res.status(500).json({[m
       success: false,[m
[31m-      message: "Gagal menghapus WhatsApp URL",[m
[32m+[m[32m      message:[m
[32m+[m[32m        "Gagal menghapus WhatsApp URL",[m
     });[m
   }[m
 };[m
\ No newline at end of file[m
[1mdiff --git a/middleware/auth.middleware.js b/middleware/auth.middleware.js[m
[1mindex 594c1b9..ab6d06b 100644[m
[1m--- a/middleware/auth.middleware.js[m
[1m+++ b/middleware/auth.middleware.js[m
[36m@@ -53,60 +53,4 @@[m [mexport const authMiddleware = async (req, res, next) => {[m
       message: "Token tidak valid",[m
     });[m
   }[m
[31m-};[m
[31m-[m
[31m-[m
[31m-[m
[31m-[m
[31m-[m
[31m-[m
[31m-[m
[31m-[m
[31m-[m
[31m-// import jwt from "jsonwebtoken";[m
[31m-// import { prisma } from "../utils/prisma.js";[m
[31m-// import { jwtSecret } from "../controller/auth.controller.js";[m
[31m-[m
[31m-// export const authMiddleware = async (req, res, next) => {[m
[31m-//   try {[m
[31m-//     const token = req.cookies.access_token;[m
[31m-[m
[31m-//     if (!token) {[m
[31m-//       return res.status(401).json({[m
[31m-//         success: false,[m
[31m-//         message: "Authentication diperlukan",[m
[31m-//       });[m
[31m-//     }[m
[31m-[m
[31m-//     const decoded = jwt.verify(token, jwtSecret);[m
[31m-[m
[31m-//     const currentUser = await prisma.user.findUnique({[m
[31m-//       where: {[m
[31m-//         id: decoded.id,[m
[31m-//       },[m
[31m-//     });[m
[31m-[m
[31m-//     if (!currentUser) {[m
[31m-//       return res.status(401).json({[m
[31m-//         success: false,[m
[31m-//         message: "User tidak valid",[m
[31m-//       });[m
[31m-//     }[m
[31m-[m
[31m-//     req.user = {[m
[31m-//       id: currentUser.id,[m
[31m-//       username: currentUser.username,[m
[31m-//       email: currentUser.email,[m
[31m-//       role: currentUser.role,[m
[31m-//     };[m
[31m-[m
[31m-//     next();[m
[31m-//   } catch (error) {[m
[31m-//     console.error("AUTH ERROR:", error);[m
[31m-[m
[31m-//     return res.status(401).json({[m
[31m-//       success: false,[m
[31m-//       message: "Token tidak valid",[m
[31m-//     });[m
[31m-//   }[m
[31m-// };[m
\ No newline at end of file[m
[32m+[m[32m};[m
\ No newline at end of file[m
[1mdiff --git a/routes/banner.routes.js b/routes/banner.routes.js[m
[1mindex c8b5214..8329a97 100644[m
[1m--- a/routes/banner.routes.js[m
[1m+++ b/routes/banner.routes.js[m
[36m@@ -15,11 +15,9 @@[m [mimport { uploadImage } from "../middleware/upload.middleware.js";[m
 [m
 const router = express.Router();[m
 [m
[31m-// PUBLIC GET[m
 router.get("/", getBanners);[m
 router.get("/:id", getBannerById);[m
 [m
[31m-// ADMIN CREATE[m
 router.post([m
   "/",[m
   authMiddleware,[m
[36m@@ -31,7 +29,6 @@[m [mrouter.post([m
   createBanner,[m
 );[m
 [m
[31m-// ADMIN UPDATE[m
 router.put([m
   "/:id",[m
   authMiddleware,[m
[36m@@ -43,7 +40,6 @@[m [mrouter.put([m
   updateBanner,[m
 );[m
 [m
[31m-// ADMIN STATUS[m
 router.patch([m
   "/:id/status",[m
   authMiddleware,[m
[36m@@ -51,7 +47,6 @@[m [mrouter.patch([m
   updateBannerStatus,[m
 );[m
 [m
[31m-// ADMIN DELETE[m
 router.delete([m
   "/:id",[m
   authMiddleware,[m
[1mdiff --git a/server.js b/server.js[m
[1mindex e758b5f..a31c385 100644[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@ -8,12 +8,13 @@[m [mimport userRoutes from "./routes/user.routes.js";[m
 import categoryRoutes from "./routes/category.route.js";[m
 import dashboardRoutes from "./routes/dashboard.route.js";[m
 import bannerRoutes from "./routes/banner.routes.js";[m
[32m+[m[32mimport orderRoutes from "./routes/order.routes.js"[m
 [m
 const app = express();[m
 [m
 const allowedOrigins = [[m
[31m-  "https://ecommercelux.netlify.app",[m
[31m-  "https://admin-dash-lovat-nine.vercel.app"[m
[32m+[m[32m  "http://localhost:5173",[m
[32m+[m[32m  "http://localhost:5174"[m
 ];[m
 [m
 app.use(cors({[m
[36m@@ -40,7 +41,8 @@[m [mapp.use("/api/auth", authRoutes);[m
 app.use("/api/products", productRoutes);[m
 app.use("/api/categories", categoryRoutes);[m
 app.use("/api/banners", bannerRoutes);[m
[31m-app.use("/api/dashboard", dashboardRoutes);[m
[32m+[m[32mapp.use("/api/dashboard", dashboardRoutes, orderRoutes);[m
[32m+[m
 [m
 app.listen(port, () => {[m
   console.log(`server sedang berjalan di port ${port}`);[m
[1mdiff --git a/utils/prisma.js b/utils/prisma.js[m
[1mindex 3937f58..bf118a6 100644[m
[1m--- a/utils/prisma.js[m
[1m+++ b/utils/prisma.js[m
[36m@@ -14,9 +14,4 @@[m [mconst prisma = new PrismaClient({[m
   adapter,[m
 });[m
 [m
[31m-console.log([m
[31m-  "PRISMA MODELS:",[m
[31m-  Object.keys(prisma).filter((key) => !key.startsWith("_")),[m
[31m-);[m
[31m-[m
 export { prisma };[m
\ No newline at end of file[m
