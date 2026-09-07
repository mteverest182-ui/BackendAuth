import * as z from "zod";

import { prisma } from "../../utils/prisma.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinaryUpload.js";

export const productSchema = z.object({
  name: z
    .string({
      error: "Nama Product Wajib Di Isi",
    })
    .trim()
    .min(1),

  brand: z
    .string({
      error: "Brand Wajib Di isi",
    })
    .trim()
    .min(1),

  gender: z.enum(["MEN", "WOMEN"], {
    error: "Gender Wajib Dipilih",    
  }),

  categoryId: z.coerce
    .number({
      error: "Category Wajib Di Pilih",
    })
    .int("Category Tidak Valid")
    .positive("Category wajib di pilih"),

  price: z.coerce
    .number({
      error: "Harga Wajib Berupa Angka",
    })
    .positive(),

  discountPercent: z.coerce.number
  ({
    error: "Discount Wajib Berupa Angka",
  })
  .int("Discount Harus Berupa Angka Bulat")
  .min(0, "Discount tidak boleh kurang dari 0%")
  .max(100, "Discount Tidak Boleh lebih dari 100%")
  .default(0),
  stock: z.coerce
    .number({
      error: "Stock wajib berupa angka",
    })
    .int("Stock harus berupa angka bulat")
    .min(0),
});

const updateProductSchema = z.object({
  name: z.string().min(3).optional(),

  price: z.coerce
    .number({
      error: "Harga Harus berupa Angka",
    })
    .positive()
    .optional(),

  discountPercent: z.coerce
    .number({
      error: "Discount Harus berupa Angka",
    })
    .int("Discount Harus Berupa Angka Bulat")
    .min(0, "Discount tidak boleh kurang dari 0%")
    .max(100, "Discount Tidak Boleh lebih dari 100%")
    .optional(),

  brand: z.string().min(2).optional(),

  gender: z.enum(["MEN", "WOMEN"]).optional(),

  stock: z.coerce
    .number({
      error: "Stock harus berupa angka",
    })
    .int("Stock harus berupa angka bulat")
    .min(0)
    .optional(),

  categoryId: z.coerce
    .number({
      error: "Category tidak valid",
    })
    .int("Category tidak valid")
    .positive("Category wajib di pilih")
    .optional(),
});

const validateProductId = (id) => {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error("ID product tidak valid");

    error.statusCode = 400;

    throw error;
  }

  return productId;
};

const getCategory = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    const error = new Error("Category tidak ditemukan");

    error.statusCode = 400;

    throw error;
  }

  return category;
};

const validateGender = (gender) => {
  if(!gender){
    return undefined;
  }

  const normalizeGender = String(gender)
    .trim()
    .toUpperCase();

   if(!["MEN", "WOMEN"].includes(normalizeGender)){
    const error = new Error(
      "Gender harus MEN atau WOMEN",
    );

    error.statusCode = 400;
    throw error;
   }
   
   return normalizeGender;
}

export const createProduct = async (body, file) => {
  if (!file) {
    const error = new Error("Foto product wajib di upload");

    error.statusCode = 400;

    throw error;
  }

  const result = productSchema.safeParse(body);

  if (!result.success) {
    const error = new Error("Data Product tidak valid");

    error.statusCode = 400;
    error.details = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    throw error;
  }

  const validated = result.data;

  await getCategory(validated.categoryId);

  let uploadedImage = null;

  try {
    uploadedImage = await uploadToCloudinary(file.buffer, "ecommerce/products");

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        price: validated.price,
        gender: validated.gender,
        discountPercent: validated.discountPercent,
        brand: validated.brand,
        stock: validated.stock,
        categoryId: validated.categoryId,

        image: uploadedImage.secure_url,
        imagePublicId: uploadedImage.public_id,
      },

      include: {
        category: true,
      },
    });

    return product;
  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Gagal cleanup gambar:", cleanupError);
      }
    }

    throw error;
  }
};

const formatProductPricing = (product) => {
  const price = Math.max(
    0,
    Number(product.price ?? 0)
  );

  const discountPercent = Math.min(
    100,
    Math.max(
      0,
      Number(product.discountPercent ?? 0)
    )
  );

  const discountedPrice =
    discountPercent > 0
      ? Math.round(
          price * (1 - discountPercent / 100)
        )
      : price;

  return {
    ...product,

    price,

    originalPrice: price,

    discountPercent,

    discountedPrice,
  };
};

export const getProducts = async (query = {}) => {
  const search = String(query.search || "").trim();
  const gender = validateGender(query.gender);

  const where = {
    ...(gender && {
      gender,
    }),

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    products: products.map(formatProductPricing),
    total: products.length,
  };
};

export const getProductById = async (id) => {
  const productId = validateProductId(id);

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },

    include: {
      category: true,
    },
  });

  if (!product) {
    const error = new Error("Product tidak ditemukan");

    error.statusCode = 404;

    throw error;
  }

  return formatProductPricing(product);

}  

export const updateProduct = async (id, body, file) => {
  const productId = validateProductId(id);

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct) {
    const error = new Error("Product tidak ditemukan");

    error.statusCode = 404;

    throw error;
  }

  const result = updateProductSchema.safeParse(body);

  if (!result.success) {
    const error = new Error("Data Product tidak valid");

    error.statusCode = 400;

    error.details = result.error.issues.map((issue) => issue.message);

    throw error;
  }

  const validated = result.data;

  if (validated.categoryId !== undefined) {
    await getCategory(validated.categoryId);
  }

  let imageUrl = existingProduct.image;

  let imagePublicId = existingProduct.imagePublicId;

  let uploadedNewImage = null;

  try {
    if (file) {
      uploadedNewImage = await uploadToCloudinary(
        file.buffer,
        "ecommerce/products",
      );

      imageUrl = uploadedNewImage.secure_url;

      imagePublicId = uploadedNewImage.public_id;
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },

      data: {
        ...validated,

        image: imageUrl,
        imagePublicId,
      },

      include: {
        category: true,
      },
    });

    if (file && existingProduct.imagePublicId) {
      try {
        await deleteFromCloudinary(existingProduct.imagePublicId);
      } catch (deleteError) {
        console.error("Gagal menghapus gambar lama:", deleteError);
      }
    }

    return formatProductPricing(updatedProduct);
  } catch (error) {
    if (uploadedNewImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedNewImage.public_id);
      } catch (cleanupError) {
        console.error("Gagal cleanup gambar baru:", cleanupError);
      }
    }

    throw error;
  }
};

export const deleteProduct = async (id) => {
  const productId = validateProductId(id);

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct) {
    const error = new Error("Product Tidak ditemukan");

    error.statusCode = 404;

    throw error;
  }

  const deletedProduct = await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  if (existingProduct.imagePublicId) {
    try {
      await deleteFromCloudinary(existingProduct.imagePublicId);
    } catch (cloudinaryError) {
      console.error("Gagal menghapus gambar Cloudinary:", cloudinaryError);

      return {
        product: deletedProduct,
        warning:
          "Product berhasil dihapus, tetapi gambar Cloudinary gagal dihapus",
        warningDetail: cloudinaryError.message,
      };
    }
  }

  return {
    product: deletedProduct,
  };
};

export const getProductsByCategory = async (categoryId, query) => {
  const parsedCategoryId = Number(categoryId);

  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
    const error = new Error("ID category tidak valid");

    error.statusCode = 400;

    throw error;
  }

  const { page, limit } = validatePagination(query);

  const gender = validateGender(query.gender);

  const skip = (page - 1) * limit;

  const where = {
    categoryId: parsedCategoryId,

    ...(gender && {
      gender,
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,

      skip,
      take: limit,

      include: {
        category: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products: products.map(formatProductPricing),

    pagination: {
      page,
      limit,
      total,
      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,
    },
  };
};