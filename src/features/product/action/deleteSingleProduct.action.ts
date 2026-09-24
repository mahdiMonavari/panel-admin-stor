"use server";

import { prisma } from "@/src/lib/prisma";

type deleteSingleProductHandlerResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
    };

export async function deleteSingleProductHandler(
  id: string,
): Promise<deleteSingleProductHandlerResult> {
  if (!id || typeof id !== "string") {
    return {
      success: false,
      message: "شناسه محصول معتبر نمیباشد",
    };
  }
  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      message: "خطا از سمت سرور دوباره تلاش کنید",
    };
  }
}
