/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProductInfo` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductInfo` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductInfo` table. All the data in the column will be lost.
  - You are about to drop the `ProductAttribute` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[infoId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `infoId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `ProductInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_attributeValueId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductInfo" DROP CONSTRAINT "ProductInfo_productId_fkey";

-- DropIndex
DROP INDEX "Product_categoryId_idx";

-- DropIndex
DROP INDEX "ProductInfo_productId_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "infoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductInfo" DROP COLUMN "createdAt",
DROP COLUMN "productId",
DROP COLUMN "updatedAt",
ADD COLUMN     "data" JSONB NOT NULL;

-- DropTable
DROP TABLE "ProductAttribute";

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductStaticAttribute" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "attributeValueId" TEXT,
    "value" TEXT,

    CONSTRAINT "ProductStaticAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariantAttributeValue" (
    "productVariantId" TEXT NOT NULL,
    "attributeValueId" TEXT NOT NULL,

    CONSTRAINT "ProductVariantAttributeValue_pkey" PRIMARY KEY ("productVariantId","attributeValueId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductStaticAttribute_productId_attributeId_key" ON "ProductStaticAttribute"("productId", "attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_infoId_key" ON "Product"("infoId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "ProductInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStaticAttribute" ADD CONSTRAINT "ProductStaticAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStaticAttribute" ADD CONSTRAINT "ProductStaticAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStaticAttribute" ADD CONSTRAINT "ProductStaticAttribute_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "AttributeValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantAttributeValue" ADD CONSTRAINT "ProductVariantAttributeValue_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantAttributeValue" ADD CONSTRAINT "ProductVariantAttributeValue_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "AttributeValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
