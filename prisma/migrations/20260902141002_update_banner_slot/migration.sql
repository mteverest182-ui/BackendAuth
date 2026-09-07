/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BannerImage` table. All the data in the column will be lost.
  - Changed the type of `placement` on the `Banner` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `endAt` to the `BannerImage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BannerSlot" AS ENUM ('HERO', 'SECONDARY_LEFT', 'SECONDARY_RIGHT', 'PROMO_1', 'PROMO_2', 'PROMO_3', 'PROMO_4');

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "createdAt",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "placement",
ADD COLUMN     "placement" "BannerSlot" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'INACTIVE',
ALTER COLUMN "startAt" DROP NOT NULL,
ALTER COLUMN "endAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BannerImage" DROP COLUMN "updatedAt",
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "BannerPlacement";

-- CreateIndex
CREATE INDEX "Banner_placement_idx" ON "Banner"("placement");

-- CreateIndex
CREATE INDEX "Banner_status_idx" ON "Banner"("status");

-- CreateIndex
CREATE INDEX "Banner_sortOrder_idx" ON "Banner"("sortOrder");

-- CreateIndex
CREATE INDEX "Banner_startAt_endAt_idx" ON "Banner"("startAt", "endAt");

-- CreateIndex
CREATE INDEX "BannerImage_device_idx" ON "BannerImage"("device");
