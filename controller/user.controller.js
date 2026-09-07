import * as z from "zod";

import {
  getUsers as getUsersService,
  createAdmin as createAdminService,
  updateAdmin as updateAdminService,
  deleteAdmin as deleteAdminService,
} from "../includes/users/service.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data user",
      data: users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const newAdmin = await createAdminService(req.body);

    return res.status(201).json({
      success: true,
      message: "Create Admin Berhasil",
      data: newAdmin,
    });
  } catch (error) {
    console.error("Create Admin Error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.issues.map((issue) => issue.message),
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Gagal Membuat User",
      error: error.statusCode ? undefined : error.message,
    });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID User Tidak Valid",
      });
    }

    const updatedAdmin = await updateAdminService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Admin berhasil diperbaharui",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Update Admin Error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.issues.map((issue) => issue.message),
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Gagal memperbarui admin",
      error: error.statusCode ? undefined : error.message,
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID user tidak valid",
      });
    }

    await deleteAdminService(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil Melakukan penghapusan Admin",
    });
  } catch (error) {
    console.error("DELETE ADMIN ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Gagal Mengapus Admin",
      error: error.statusCode ? undefined : error.message,
    });
  }
};
