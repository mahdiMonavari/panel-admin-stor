/*
  Warnings:

  - You are about to drop the column `attributeValueId` on the `ProductStaticAttribute` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductStaticAttribute" DROP CONSTRAINT "ProductStaticAttribute_attributeValueId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductStaticAttribute" DROP COLUMN "attributeValueId";

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "stock" DROP NOT NULL;
