-- CreateEnum
CREATE TYPE "BannerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BannerPlacement" AS ENUM ('HOMEPAGE_HERO', 'HOMEPAGE_SECONDARY', 'HOMPAGE_PROMO');

-- CreateEnum
CREATE TYPE "BannerDevice" AS ENUM ('DESKTOP', 'TABLET', 'MOBILE', 'SQUARE');

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "placement" "BannerPlacement" NOT NULL,
    "status" "BannerStatus" NOT NULL,
    "linkUrl" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerImage" (
    "id" SERIAL NOT NULL,
    "bannerId" INTEGER NOT NULL,
    "device" "BannerDevice" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BannerImage_bannerId_idx" ON "BannerImage"("bannerId");

-- CreateIndex
CREATE UNIQUE INDEX "BannerImage_bannerId_device_key" ON "BannerImage"("bannerId", "device");

-- AddForeignKey
ALTER TABLE "BannerImage" ADD CONSTRAINT "BannerImage_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
