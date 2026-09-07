/*
  Warnings:

  - The values [USER,SUPER_ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createAt` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `desktopImage` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `desktopImagePublicId` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `mobileImage` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `mobileImagePublicId` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `endAt` on the `BannerImage` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "createAt",
DROP COLUMN "desktopImage",
DROP COLUMN "desktopImagePublicId",
DROP COLUMN "mobileImage",
DROP COLUMN "mobileImagePublicId",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "BannerImage" DROP COLUMN "endAt";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'ADMIN';
