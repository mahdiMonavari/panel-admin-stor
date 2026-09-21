-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "minPrice" DECIMAL(65,30),
ADD COLUMN     "totalStock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "discountPercent" DECIMAL(65,30);
