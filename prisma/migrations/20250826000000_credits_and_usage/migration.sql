-- CreateEnum
CREATE TYPE "UsageType" AS ENUM ('AI_ANALYZE', 'AI_MATCH', 'TOP_UP', 'ADJUST');

-- CreateTable
CREATE TABLE "Usage" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "type" "UsageType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Usage_brandId_createdAt_idx" ON "Usage"("brandId", "createdAt");

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN "credits" INTEGER NOT NULL DEFAULT 0;
