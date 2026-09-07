-- CreateTable
CREATE TABLE "AppSetting" (
    "id" SERIAL NOT NULL,
    "whatsappUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);
