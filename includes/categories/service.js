import * as z from "zod";
import { prisma } from "../../utils/prisma.js";

const categorySchema = z.object({
  name: z
    .string({
      error: "Nama category wajib di isi",
    })
    .trim()
    .min(1, "Nama category wajib di isi"),
});

const createSlug = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    const error = new Error("Category tidak ditemukan");

    error.statusCode = 404;

    throw error;
  }

  return category;
};

export const createCategory = async (body) => {
  const result = categorySchema.safeParse(body);

  if (!result.success) {
    const error = new Error(result.error.issues[0].message);

    error.statusCode = 400;

    throw error;
  }

  const { name } = result.data;

  const slug = createSlug(name);

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        {
          slug,
        },
      ],
    },
  });

  if (existingCategory) {
    const error = new Error("Category sudah tersedia");

    error.statusCode = 409;

    throw error;
  }

  return prisma.category.create({
    data: {
      name,
      slug,
    },
  });
};

export const updateCategory = async (id, body) => {
  const result = categorySchema.safeParse(body);

  if (!result.success) {
    const error = new Error(result.error.issues[0].message);

    error.statusCode = 400;

    throw error;
  }

  const { name } = result.data;

  const slug = createSlug(name);

  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    const error = new Error("Category tidak ditemukan");

    error.statusCode = 404;

    throw error;
  }

  const duplicateCategory = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        {
          slug,
        },
      ],
      NOT: {
        id,
      },
    },
  });

  if (duplicateCategory) {
    const error = new Error("Nama category sudah digunakan");

    error.statusCode = 409;

    throw error;
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
    },
  });
};

export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          product: true,
        },
      },
    },
  });

  if (!category) {
    const error = new Error("Category tidak ditemukan");

    error.statusCode = 404;

    throw error;
  }

  if (category._count.product > 0) {
    const error = new Error("Category ini Masih Memiliki Product");

    error.statusCode = 409;

    throw error;
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });
};

export const getProducts = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
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

export const getProductsByCategoryId = async (categoryId, page, limit) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId,
      },
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
      where: {
        categoryId,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
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
