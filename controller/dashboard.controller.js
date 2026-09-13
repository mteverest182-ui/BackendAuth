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

export const getWhatsappSetting = async (
  req,
  res,
) => {
  try {
    const setting =
      await prisma.appSetting.findFirst();

    const whatsappUrl =
      setting?.whatsappUrl ?? "";

    return res.status(200).json({
      success: true,
      data: {
        whatsappUrl,
      },
    });
  } catch (error) {
    console.error(
      "GET WHATSAPP SETTING ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil WhatsApp URL",
    });
  }
};

export const updateWhatsappSetting = async (
  req,
  res,
) => {
  try {
    const { whatsappUrl } = req.body;

    const url = String(
      whatsappUrl || "",
    ).trim();

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL wajib diisi",
      });
    }

    let parsed;

    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message:
          "Format URL tidak valid",
      });
    }

    if (
      !["http:", "https:"].includes(
        parsed.protocol,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "URL harus menggunakan HTTP atau HTTPS",
      });
    }

    const existing =
      await prisma.appSetting.findFirst();

    const setting = existing
      ? await prisma.appSetting.update({
          where: {
            id: existing.id,
          },
          data: {
            whatsappUrl: url,
          },
        })
      : await prisma.appSetting.create({
          data: {
            whatsappUrl: url,
          },
        });

    return res.status(200).json({
      success: true,
      message:
        "Order URL berhasil disimpan",
      data: {
        ...setting,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE WHATSAPP SETTING ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menyimpan WhatsApp URL",
    });
  }
};

export const deleteWhatsappSetting = async (
  req,
  res,
) => {
  try {
    const setting =
      await prisma.appSetting.findFirst();

    if (!setting) {
      return res.status(404).json({
        success: false,
        message:
          "WhatsApp URL belum tersedia",
      });
    }

    await prisma.appSetting.delete({
      where: {
        id: setting.id,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Order URL berhasil dihapus",
      data: {
        whatsappUrl: "",
        orderChannel: null,
      },
    });
  } catch (error) {
    console.error(
      "DELETE WHATSAPP SETTING ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menghapus WhatsApp URL",
    });
  }
};