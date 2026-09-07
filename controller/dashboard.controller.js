import { success } from "zod";
import { prisma } from "../utils/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalCategories, totalUsers] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.user.count(),
      ]);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil dashboard statistics",
      data: {
        totalProducts,
        totalCategories,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil dashboard statistics",
    });
  }
};

export const getWhatsappSetting = async (req, res) => {
    try {
        const setting = await prisma.appSetting.findFirst();

        return res.status(200).json({
            success: true,
            data: {
                whatsappUrl: setting?.whatsappUrl ?? "",
            },
        });
    }catch(error){
        console.error("Get whatsapp Setting Error", error);

        return res.status(500).json({
            success: false,
            message:"Gagal Mengambil Whatsapp URL",
        });
    }
};

export const updateWhatsappSetting = async(req, res) => {
    try { 
        const { whatsappUrl} = req.body;

        const existing = await prisma.appSetting.findFirst();

        const setting = existing ? await prisma.appSetting.update({
            where: {
                id: existing.id,
            },
            data: {
                whatsappUrl
            },
        })
        : await prisma.appSetting.create({
            data: {
                whatsappUrl,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Whatsapp Url Berhasil disimpan",
            data: setting,
        });
    }catch(error){
        console.error("UPDATE WHATSAPP SETTING ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal menyimpan whatsapp URL",
        });
    }
};

export const deleteWhatsappSetting = async (req, res) => {
  try {
    const setting = await prisma.appSetting.findFirst();

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "WhatsApp URL belum tersedia",
      });
    }

    await prisma.appSetting.delete({
      where: {
        id: setting.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "WhatsApp URL berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE WHATSAPP SETTING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghapus WhatsApp URL",
    });
  }
};