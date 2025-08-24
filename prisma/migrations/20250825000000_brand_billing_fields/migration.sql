-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_stripeCustomerId_key" ON "Brand"("stripeCustomerId");
