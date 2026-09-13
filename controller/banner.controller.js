import {
    deleteBannerImage,
    uploadBannerImage,
} from "../utils/bannerUpload.js";

import { prisma } from "../utils/prisma.js";


const BANNER_DIMENSIONS = {
    desktop: {
        width: 1920,
        height: 600,
    },
    mobile: {
        width: 750,
        height: 500,
    },
};

const ALLOWED_SLOT_KEYS = [
    "HERO",
    "SECONDARY_LEFT",
    "SECONDARY_RIGHT",
    "MOBILE_FEATURED_1",
    "MOBILE_FEATURED_2",
    "PROMO_1",
    "PROMO_2",
    "PROMO_3",
    "PROMO_4",
];

const ALLOWED_STATUS = [
    "ACTIVE",
    "INACTIVE",
];

const ALLOWED_DEVICES = [
    "desktop",
    "mobile",
];

/*
 * =========================
 * HELPERS
 * =========================
 */

const parseDate = (value) => {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new Error("Format tanggal tidak valid");
    }

    return date;
};

const parseBannerId = (value) => {
    const id = Number(value);

    if (!Number.isInteger(id)) {
        throw new Error("ID banner tidak valid");
    }

    return id;
};

/*
 * =========================
 * VALIDATE IMAGE
 * =========================
 */

const validateBannerFiles = async (
    files,
    required = true,
) => {
    const fileEntries = Object.entries(
        files || {},
    );

    if (
        required &&
        fileEntries.length === 0
    ) {
        throw new Error(
            "Minimal satu gambar banner harus diupload",
        );
    }

    for (const [device, fileList] of fileEntries) {
        if (
            !ALLOWED_DEVICES.includes(device)
        ) {
            throw new Error(
                `Device banner tidak valid: ${device}`,
            );
        }

        const file = fileList?.[0];

        if (!file?.buffer) {
            throw new Error(
                `File ${device} tidak valid`,
            );
        }
    }
};

/*
 * =========================
 * UPLOAD IMAGES
 * =========================
 */

const uploadImages = async (
    files,
    bannerId,
) => {
    const uploadedImages = [];

    for (const [
        device,
        fileList,
    ] of Object.entries(files || {})) {
        const file = fileList?.[0];

        if (!file) {
            continue;
        }

        const uploaded =
            await uploadBannerImage(
                file,
                bannerId,
                device.toUpperCase(),
            );

        uploadedImages.push({
            device: device.toUpperCase(),
            imageUrl: uploaded.imageUrl,
            publicId: uploaded.publicId,
            width: uploaded.width,
            height: uploaded.height,
            fileSize: uploaded.fileSize,
            mimeType: uploaded.mimeType,
        });
    }

    return uploadedImages;
};

/*
 * =========================
 * CREATE
 * =========================
 */

export const createBanner = async (
    req,
    res,
) => {
    let banner = null;

    const uploadedCloudinaryImages = [];

    try {
        const {
            title,
            description,
            slotKey = "HERO",
            status = "INACTIVE",
            linkUrl,
            startAt,
            endAt,
            sortOrder = 0,
        } = req.body;

        /*
         * =========================
         * TITLE
         * =========================
         */

        if (!title?.trim()) {
            return res.status(400).json({
                message:
                    "Title banner wajib diisi",
            });
        }

        /*
         * =========================
         * SLOT
         * =========================
         */

        if (
            !ALLOWED_SLOT_KEYS.includes(
                slotKey,
            )
        ) {
            return res.status(400).json({
                message:
                    "Slot banner tidak valid",
            });
        }

        /*
         * =========================
         * CEK DUPLICATE SLOT
         * =========================
         */

        const existingSlot =
            await prisma.banner.findUnique({
                where: {
                    slotKey,
                },
            });

        if (existingSlot) {
            return res.status(409).json({
                message:
                    `Slot ${slotKey} sudah digunakan. ` +
                    "Silakan gunakan slot lain atau edit banner yang sudah ada.",
            });
        }

        /*
         * =========================
         * STATUS
         * =========================
         */

        if (
            !ALLOWED_STATUS.includes(
                status,
            )
        ) {
            return res.status(400).json({
                message:
                    "Status banner tidak valid",
            });
        }

        /*
         * =========================
         * FILE
         * =========================
         */

        const files = req.files || {};

        const fileEntries =
            Object.entries(files);

        if (fileEntries.length === 0) {
            return res.status(400).json({
                message:
                    "Minimal satu gambar banner harus diupload",
            });
        }

        /*
         * =========================
         * DATE
         * =========================
         */

        let parsedStartAt;
        let parsedEndAt;

        try {
            parsedStartAt =
                parseDate(startAt);

            parsedEndAt =
                parseDate(endAt);
        } catch (error) {
            return res.status(400).json({
                message:
                    error.message,
            });
        }

        /*
         * =========================
         * VALIDATE DATE RANGE
         * =========================
         */

        if (
            parsedStartAt &&
            parsedEndAt &&
            parsedStartAt >=
                parsedEndAt
        ) {
            return res.status(400).json({
                message:
                    "StartAt harus lebih kecil dari EndAt",
            });
        }

        /*
         * =========================
         * CREATE BANNER
         * =========================
         */

        banner =
            await prisma.banner.create({
                data: {
                    title:
                        title.trim(),

                    description:
                        description?.trim() ||
                        null,

                    slotKey,

                    status,

                    linkUrl:
                        linkUrl?.trim() ||
                        null,

                    startAt:
                        parsedStartAt,

                    endAt:
                        parsedEndAt,

                    sortOrder:
                        Number(sortOrder) ||
                        0,
                },
            });

        /*
         * =========================
         * UPLOAD IMAGES
         * =========================
         */

        const uploadedImages =
            await uploadImages(
                files,
                banner.id,
            );

        /*
         * =========================
         * SAVE IMAGES
         * =========================
         */

        for (
            const image of
                uploadedImages
        ) {
            uploadedCloudinaryImages.push(
                image,
            );

            await prisma.bannerImage.create(
                {
                    data: {
                        bannerId:
                            banner.id,

                        device:
                            image.device,

                        imageUrl:
                            image.imageUrl,

                        publicId:
                            image.publicId,

                        width:
                            image.width,

                        height:
                            image.height,

                        fileSize:
                            image.fileSize,

                        mimeType:
                            image.mimeType,
                    },
                },
            );
        }

        /*
         * =========================
         * GET FINAL DATA
         * =========================
         */

        const result =
            await prisma.banner.findUnique(
                {
                    where: {
                        id: banner.id,
                    },

                    include: {
                        images: {
                            orderBy: {
                                device:
                                    "asc",
                            },
                        },
                    },
                },
            );

        /*
         * =========================
         * SUCCESS
         * =========================
         */

        return res.status(201).json({
            message:
                "Banner berhasil dibuat",

            data: result,
        });
    } catch (error) {
        console.error(
            "Create Banner Error:",
            error,
        );

        /*
         * =========================
         * CLEAN CLOUDINARY
         * =========================
         */

        for (
            const image of
                uploadedCloudinaryImages
        ) {
            if (!image?.publicId) {
                continue;
            }

            await deleteBannerImage(
                image.publicId,
            ).catch(() => {});
        }

        /*
         * =========================
         * CLEAN DATABASE
         * =========================
         */

        if (banner) {
            await prisma.banner.delete({
                where: {
                    id: banner.id,
                },
            }).catch(() => {});
        }

        /*
         * =========================
         * PRISMA DUPLICATE
         * =========================
         */

        if (
            error?.code === "P2002"
        ) {
            return res.status(409).json({
                message:
                    "Slot banner tersebut sudah digunakan. " +
                    "Silakan gunakan slot lain atau edit banner yang sudah ada.",
            });
        }

        /*
         * =========================
         * SERVER ERROR
         * =========================
         */

        return res.status(500).json({
            message:
                error.message ||
                "Gagal membuat banner",
        });
    }
};

/*
 * =========================
 * GET ALL
 * =========================
 */

export const getBanners = async (
    req,
    res,
) => {
    try {
        const {
            status,
            slotKey,
        } = req.query;

        const where = {};

        if (status) {
            if (
                !ALLOWED_STATUS.includes(
                    status,
                )
            ) {
                return res.status(400).json({
                    message:
                        "Status banner tidak valid",
                });
            }

            where.status = status;
        }

        if (slotKey) {
            if (
                !ALLOWED_SLOT_KEYS.includes(
                    slotKey,
                )
            ) {
                return res.status(400).json({
                    message:
                        "Slot banner tidak valid",
                });
            }

            where.slotKey = slotKey;
        }

        const banners =
            await prisma.banner.findMany({
                where,

                include: {
                    images: {
                        orderBy: {
                            device: "asc",
                        },
                    },
                },

                orderBy: [
                    {
                        slotKey: "asc",
                    },
                    {
                        sortOrder: "asc",
                    },
                    {
                        id: "desc",
                    },
                ],
            });

        return res.status(200).json({
            message:
                "Banner berhasil diambil",
            data: banners,
        });
    } catch (error) {
        console.error(
            "Get banners error:",
            error,
        );

        return res.status(500).json({
            message:
                "Gagal mengambil data banner",
            error: error.message,
        });
    }
};

/*
 * =========================
 * GET BY ID
 * =========================
 */

export const getBannerById = async (
    req,
    res,
) => {
    try {
        let id;

        try {
            id = parseBannerId(
                req.params.id,
            );
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        const banner =
            await prisma.banner.findUnique({
                where: {
                    id,
                },

                include: {
                    images: {
                        orderBy: {
                            device: "asc",
                        },
                    },
                },
            });

        if (!banner) {
            return res.status(404).json({
                message:
                    "Banner tidak ditemukan",
            });
        }

        return res.status(200).json({
            message:
                "Banner berhasil diambil",
            data: banner,
        });
    } catch (error) {
        console.error(
            "Get banner by id error:",
            error,
        );

        return res.status(500).json({
            message:
                "Gagal mengambil detail banner",
        });
    }
};

/*
 * =========================
 * UPDATE
 * =========================
 */

export const updateBanner = async (
    req,
    res,
) => {
    const uploadedImages = [];

    try {
        let id;

        try {
            id = parseBannerId(
                req.params.id,
            );
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        const existingBanner =
            await prisma.banner.findUnique({
                where: {
                    id,
                },
                include: {
                    images: true,
                },
            });

        if (!existingBanner) {
            return res.status(404).json({
                message:
                    "Banner tidak ditemukan",
            });
        }

        const {
            title,
            description,
            slotKey,
            status,
            linkUrl,
            startAt,
            endAt,
            sortOrder,
        } = req.body;

        /*
         * FILES
         *
         * Saat update, gambar tidak wajib
         * diupload ulang.
         */
        const files = req.files || {};

        await validateBannerFiles(
            files,
            false,
        );

        /*
         * TITLE
         */
        if (!title?.trim()) {
            return res.status(400).json({
                message:
                    "Title banner wajib diisi",
            });
        }

        /*
         * SLOT
         */
        if (
            slotKey &&
            !ALLOWED_SLOT_KEYS.includes(
                slotKey,
            )
        ) {
            return res.status(400).json({
                message:
                    "Slot banner tidak valid",
            });
        }

        /*
         * STATUS
         */
        if (
            status &&
            !ALLOWED_STATUS.includes(
                status,
            )
        ) {
            return res.status(400).json({
                message:
                    "Status banner tidak valid",
            });
        }

        /*
         * DATE
         */
        let parsedStartAt;
        let parsedEndAt;

        try {
            parsedStartAt =
                parseDate(startAt);

            parsedEndAt =
                parseDate(endAt);
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        if (
            parsedStartAt &&
            parsedEndAt &&
            parsedStartAt >= parsedEndAt
        ) {
            return res.status(400).json({
                message:
                    "StartAt harus lebih kecil dari EndAt",
            });
        }

        /*
         * UPDATE METADATA
         */
        await prisma.banner.update({
            where: {
                id,
            },

            data: {
                title: title.trim(),

                description:
                    description?.trim() ||
                    null,

                slotKey:
                    slotKey ||
                    existingBanner.slotKey,

                status:
                    status ||
                    existingBanner.status,

                linkUrl:
                    linkUrl?.trim() ||
                    null,

                startAt:
                    parsedStartAt,

                endAt:
                    parsedEndAt,

                sortOrder:
                    Number(sortOrder) || 0,
            },
        });

        /*
         * UPDATE IMAGES
         *
         * Hanya device yang mengirim file
         * yang akan diganti.
         */
        for (const device of
            ALLOWED_DEVICES) {
            const file =
                files?.[device]?.[0];

            if (!file) {
                continue;
            }

            const deviceName =
                device.toUpperCase();

            const oldImage =
                existingBanner.images.find(
                    (image) =>
                        image.device ===
                        deviceName,
                );

            /*
             * UPLOAD NEW IMAGE
             */
            const uploaded =
                await uploadBannerImage(
                    file,
                    id,
                    deviceName,
                );

            uploadedImages.push(
                uploaded,
            );

            /*
             * DELETE OLD CLOUDINARY IMAGE
             */
            if (oldImage?.publicId) {
                await deleteBannerImage(
                    oldImage.publicId,
                ).catch((error) => {
                    console.error(
                        "Failed deleting old banner image:",
                        error,
                    );
                });
            }

            /*
             * DELETE OLD DATABASE IMAGE
             */
            if (oldImage) {
                await prisma.bannerImage.delete({
                    where: {
                        id: oldImage.id,
                    },
                });
            }

            /*
             * CREATE NEW DATABASE IMAGE
             */
            await prisma.bannerImage.create({
                data: {
                    bannerId: id,
                    device: deviceName,
                    imageUrl:
                        uploaded.imageUrl,
                    publicId:
                        uploaded.publicId,
                    width:
                        uploaded.width,
                    height:
                        uploaded.height,
                    fileSize:
                        uploaded.fileSize,
                    mimeType:
                        uploaded.mimeType,
                },
            });
        }

        /*
         * GET UPDATED DATA
         */
        const result =
            await prisma.banner.findUnique({
                where: {
                    id,
                },
                include: {
                    images: {
                        orderBy: {
                            device: "asc",
                        },
                    },
                },
            });

        return res.status(200).json({
            message:
                "Banner berhasil diperbarui",
            data: result,
        });
    } catch (error) {
        console.error(
            "Update Banner Error:",
            error,
        );

        /*
         * CLEAN NEW CLOUDINARY IMAGES
         */
        for (const image of
            uploadedImages) {
            if (image?.publicId) {
                await deleteBannerImage(
                    image.publicId,
                ).catch(() => {});
            }
        }

        return res.status(500).json({
            message:
                error.message ||
                "Gagal memperbarui banner",
        });
    }
};


/*
 * =========================
 * DELETE
 * =========================
 */

export const deleteBanner = async (
    req,
    res,
) => {
    try {
        let id;

        try {
            id = parseBannerId(
                req.params.id,
            );
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        const banner =
            await prisma.banner.findUnique({
                where: {
                    id,
                },

                include: {
                    images: true,
                },
            });

        if (!banner) {
            return res.status(404).json({
                message:
                    "Banner tidak ditemukan",
            });
        }

        /*
         * DELETE CLOUDINARY
         */
        for (const image of
            banner.images) {
            if (!image.publicId) {
                continue;
            }

            try {
                await deleteBannerImage(
                    image.publicId,
                );
            } catch (error) {
                console.error(
                    `Gagal menghapus image Cloudinary ${image.publicId}:`,
                    error,
                );
            }
        }

        /*
         * DELETE DATABASE
         */
        await prisma.banner.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            message:
                "Banner berhasil dihapus",
        });
    } catch (error) {
        console.error(
            "Delete Banner Error:",
            error,
        );

        return res.status(500).json({
            message:
                error.message ||
                "Gagal menghapus banner",
        });
    }
};

/*
 * =========================
 * UPDATE STATUS
 * =========================
 */

export const updateBannerStatus = async (
    req,
    res,
) => {
    try {
        let id;

        try {
            id = parseBannerId(
                req.params.id,
            );
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        const { status } = req.body;

        if (
            !ALLOWED_STATUS.includes(status)
        ) {
            return res.status(400).json({
                message:
                    "Status banner tidak valid",
            });
        }

        const banner =
            await prisma.banner.findUnique({
                where: {
                    id,
                },
            });

        if (!banner) {
            return res.status(404).json({
                message:
                    "Banner tidak ditemukan",
            });
        }

        const updated =
            await prisma.banner.update({
                where: {
                    id,
                },

                data: {
                    status,
                },

                include: {
                    images: true,
                },
            });

        return res.status(200).json({
            message:
                "Status banner berhasil diperbarui",
            data: updated,
        });
    } catch (error) {
        console.error(
            "Update Banner Status Error:",
            error,
        );

        return res.status(500).json({
            message:
                "Gagal memperbarui status banner",
        });
    }
};