/*
  Warnings:

  - A unique constraint covering the columns `[productId,signature]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signature` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signature" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ProductVariant_productId_isActive_idx" ON "ProductVariant"("productId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_signature_key" ON "ProductVariant"("productId", "signature");
