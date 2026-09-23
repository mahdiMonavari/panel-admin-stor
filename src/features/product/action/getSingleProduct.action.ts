"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";

// نوع اصلی Prisma (برای استفاده داخلی)
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    variants: { include: { values: { include: { attributeValue: true } } } };
    staticAttributes: {
      include: { attribute: { select: { label: true; name: true } } };
    };
    category: { select: { name: true } };
  };
}>;

// نوع serialize شده برای ارسال به کامپوننت کلاینت
export type SerializedProduct = Omit<ProductWithRelations, "variants"> & {
  variants: Array<
    Omit<
      ProductWithRelations["variants"][number],
      "price" | "discountPercent"
    > & {
      price: number;
      discountPercent: number;
    }
  >;
};

type getSingleProductResult =
  | { success: false; message: string }
  | { success: true; data: SerializedProduct };

export async function getSingleProduct(
  id: string,
): Promise<getSingleProductResult> {
  if (!id || typeof id !== "string") {
    return { success: false, message: "آی دی محصول معتبر نمی‌باشد" };
  }

  try {
    const product = await prisma.product.findFirst({
      where: { id },
      include: {
        variants: {
          include: { values: { include: { attributeValue: true } } },
        },
        staticAttributes: {
          include: { attribute: { select: { label: true, name: true } } },
        },
        category: { select: { name: true } },
      },
    });

    if (!product) {
      return { success: false, message: "محصولی با این آیدی یافت نشد" };
    }

    // تبدیل Decimal به number
    const serializedProduct: SerializedProduct = {
      ...product,
      variants: product.variants.map((variant) => ({
        ...variant,
        price: variant.price ? Number(variant.price) : 0,
        discountPercent: variant.discountPercent
          ? Number(variant.discountPercent)
          : 0,
      })),
    };

    return { success: true, data: serializedProduct };
  } catch (error) {
    return { success: false, message: "خطا از سمت سرور، دوباره تلاش کنید" };
  }
}
