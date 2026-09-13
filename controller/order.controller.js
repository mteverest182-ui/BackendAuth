import { prisma } from "../utils/prisma.js";
import { detectOrderChannel } from "../utils/orderChannel.js";

export const getOrderSetting = async (
  req,
  res,
) => {
  try {
    const setting =
      await prisma.appSetting.findFirst();

    const orderUrl =
      setting?.whatsappUrl ?? "";

    if (!orderUrl) {
      return res.status(200).json({
        success: true,
        data: {
          orderUrl: "",
          orderChannel: null,
          whatsappDestination: null,
        },
      });
    }

    const detection =
      await detectOrderChannel(
        orderUrl,
      );

    return res.status(200).json({
      success: true,
      data: {
        orderUrl,

        orderChannel:
          detection.orderChannel,

        whatsappDestination:
          detection.orderChannel ===
          "whatsapp"
            ? detection.finalUrl
            : null,
      },
    });
  } catch (error) {
    console.error(
      "GET ORDER SETTING ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil Order Setting",
    });
  }
};