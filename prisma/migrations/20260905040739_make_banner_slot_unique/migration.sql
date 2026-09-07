/*
  Warnings:

  - The values [TABLET,SQUARE] on the enum `BannerDevice` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[slotKey]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BannerDevice_new" AS ENUM ('DESKTOP', 'MOBILE');
ALTER TABLE "BannerImage" ALTER COLUMN "device" TYPE "BannerDevice_new" USING ("device"::text::"BannerDevice_new");
ALTER TYPE "BannerDevice" RENAME TO "BannerDevice_old";
ALTER TYPE "BannerDevice_new" RENAME TO "BannerDevice";
DROP TYPE "public"."BannerDevice_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "Banner_slotKey_key" ON "Banner"("slotKey");
