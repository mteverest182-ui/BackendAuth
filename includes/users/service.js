import * as z from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma.js";

const createAdminSchema = z.object({
  username: z.string().min(6, "Username minimal 6 karakter").trim(),

  email: z
    .string()
    .email("Email harus berformat example@mail.com")
    .trim()
    .toLowerCase(),

  password: z.string().min(6, "Password minimal 6 karakter"),
});

const updateAdminSchema = z.object({
  username: z.string().min(6, "Username minimal 6 karakter").trim().optional(),

  email: z
    .string()
    .email("Email harus berformat example@mail.com")
    .trim()
    .toLowerCase()
    .optional(),

  password: z.string().min(8, "Password minimal 8 karakter").optional(),

  role: z.enum(["ADMIN"]).optional(),
});

export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const createAdmin = async (body) => {
  const validated = createAdminSchema.parse(body);

  const existingEmail = await prisma.user.findUnique({
    where: {
      email: validated.email,
    },
  });

  if (existingEmail) {
    const error = new Error("Email sudah terdaftar");
    error.statusCode = 400;
    throw error;
  }

  const existingUsername = await prisma.user.findUnique({
    where: {
      username: validated.username,
    },
  });

  if (existingUsername) {
    const error = new Error("Username sudah terdaftar");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  return prisma.user.create({
    data: {
      username: validated.username,
      email: validated.email,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
};

export const updateAdmin = async (id, body) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    const error = new Error("User Tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "SUPER_ADMIN") {
    const error = new Error("SUPER_ADMIN tidak dapat diedit");

    error.statusCode = 403;
    throw error;
  }

  if (user.role !== "ADMIN") {
    const error = new Error("Hanya Admin yang dapat diedit");

    error.statusCode = 403;
    throw error;
  }

  const validated = updateAdminSchema.parse(body);

  if (validated.username && validated.username !== user.username) {
    const existingUsername = await prisma.user.findUnique({
      where: {
        username: validated.username,
      },
    });

    if (existingUsername) {
      const error = new Error("Username sudah digunakan");

      error.statusCode = 400;
      throw error;
    }
  }

  if (validated.email && validated.email !== user.email) {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    });

    if (existingEmail) {
      const error = new Error("Email sudah digunakan");

      error.statusCode = 400;
      throw error;
    }
  }

  const data = {};

  if (validated.username) {
    data.username = validated.username;
  }

  if (validated.email) {
    data.email = validated.email;
  }

  if (validated.password) {
    data.password = await bcrypt.hash(validated.password, 10);
  }

  if (Object.keys(data).length === 0) {
    const error = new Error("Tidak ada data yang diperbarui");

    error.statusCode = 400;
    throw error;
  }

  return prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
};

export const deleteAdmin = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    const error = new Error("User Tidak ditemukan");

    error.statusCode = 404;
    throw error;
  }

  if (user.role !== "ADMIN") {
    const error = new Error("Hanya Admin yang dapat di hapus");

    error.statusCode = 403;
    throw error;
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });
};
