/*
  Warnings:

  - Added the required column `slotKey` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BannerSlot" ADD VALUE 'MOBILE_FEATURED_1';
ALTER TYPE "BannerSlot" ADD VALUE 'MOBILE_FEATURED_2';

-- DropIndex
DROP INDEX "Banner_placement_idx";

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "slotKey" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Banner_slotKey_idx" ON "Banner"("slotKey");
