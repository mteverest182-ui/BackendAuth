import {
  getCategories as getCategoriesService,
  getCategoryById as getCategoryByIdService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  getProducts as getProductsService,
  getProductsByCategoryId as getProductsByCategoryIdService,
} from "../includes/categories/service.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesService();

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua Category",
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Gagal Mengambil data category",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID category tidak valid",
      });
    }

    const category = await getCategoryByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil category",
      data: category,
    });
  } catch (error) {
    console.error("GET CATEGORY BY ID ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Gagal mengambil category",
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryService(req.body);

    return res.status(201).json({
      success: true,
      message: "Category berhasil dibuat",
      data: category,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Gagal membuat category",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID category tidak valid",
      });
    }

    const category = await updateCategoryService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Category berhasil diupdate",
      data: category,
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Gagal update category",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID category tidak valid",
      });
    }

    await deleteCategoryService(id);

    return res.status(200).json({
      success: true,
      message: "Category berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Gagal menghapus category",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);

    const result = await getProductsService(page, limit);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua product",
      data: result,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil semua product",
      error: error.message,
    });
  }
};

export const getProductsByCategoryID = async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID category tidak valid",
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);

    const result = await getProductsByCategoryIdService(
      categoryId,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil product berdasarkan category",
      data: result,
    });
  } catch (error) {
    console.error("GET PRODUCTS BY CATEGORY ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Gagal mengambil product berdasarkan category",
    });
  }
};
