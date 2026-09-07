import {
  createProduct as createProductService,
  getProducts as getProductsService,
  getProductById as getProductByIdService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  getProductsByCategory as getProductsByCategoryService,
} from "../includes/product/service.js";

export const createProduct = async (req, res) => {
  try {
    const product = await createProductService(req.body, req.file);

    return res.status(201).json({
      success: true,
      message: "Product Berhasil dibuat",
      data: product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,

      message: error.statusCode ? error.message : "Server Down",

      ...(error.details && {
        errors: error.details,
      }),
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const result = await getProductsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua product",

      data: result.products,

      pagination: result.pagination,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Gagal mengambil product",

      ...(error.statusCode === undefined && {
        error: error.message,
      }),
    });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan product",

      data: product,
    });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server Down",

      ...(error.statusCode === undefined && {
        error: error.message,
      }),
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await updateProductService(
      req.params.id,
      req.body,
      req.file,
    );

    return res.status(200).json({
      success: true,
      message: "Product berhasil diperbaharui",

      data: product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,

      message: error.statusCode ? error.message : "Server Down",

      ...(error.details && {
        errors: error.details,
      }),
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await deleteProductService(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.warning || "Product berhasil dihapus",

      data: result.product,

      ...(result.warning && {
        warning: result.warningDetail,
      }),
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,

      message: error.statusCode ? error.message : "Server Down",

      ...(error.statusCode === undefined && {
        error: error.message,
      }),
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const result = await getProductsByCategoryService(
      req.params.categoryId,
      req.query,
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

      message: error.statusCode ? error.message : "Server Down",

      ...(error.statusCode === undefined && {
        error: error.message,
      }),
    });
  }
};
