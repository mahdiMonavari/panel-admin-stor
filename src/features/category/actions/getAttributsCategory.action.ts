"use server";
import { prisma } from "@/src/lib/prisma";

export async function getSelectedAttributes(id: string) {
  try {
    const attributes = await prisma.categoryAttribute.findMany({
      where: {
        categoryId: id,
      },
    });
    const data = attributes.map((attribute) => attribute.attributeId);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "خطا از سمت سرور دوباره تلاش کنید",
    };
  }
}
