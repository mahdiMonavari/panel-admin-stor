"use server";
import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/src/lib/prisma";

type GetAttributesByCategoryIdResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      attributes: Prisma.AttributeGetPayload<{ include: { values: true } }>[];
    };

export async function GetAttributesByCategoryId(
  id: string[],
): Promise<GetAttributesByCategoryIdResult> {
  try {
    if (!id || id.length === 0) {
      return { success: true, attributes: [] };
    }

    const attributes = await prisma.attribute.findMany({
      where: {
        categories: {
          some: {
            categoryId: {
              in: id,
            },
          },
        },
      },
      include: {
        values: true,
      },
    });

    return {
      success: true,
      attributes,
    };
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return {
      success: false,
      message: "خطا در دریافت ویژگی‌ها",
    };
  }
}
