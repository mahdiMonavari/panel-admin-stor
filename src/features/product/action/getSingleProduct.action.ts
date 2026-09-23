"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";

type getSingleProductResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      data: Prisma.ProductGetPayload<{}>;
    };
export async function getSingleProduct(
  id: string,
): Promise<getSingleProductResult> {
  if (!id || typeof id !== "string") {
    return {
      success: false,
      message: "آی دی محصول معتبر نمیباشد",
    };
  }
  try {
    const product = await prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        variants: {
          include: { values: { include: { attributeValue: true } } },
        },
        staticAttributes: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    if (product) {
      return {
        success: true,
        data: product,
      };
    } else {
      return { success: false, message: "محصولی با این آیدی یافت نشد" };
    }
  } catch (error) {
    return { success: false, message: "خطا از سمت سرور دوباره تلاش کنید" };
  }
}
