"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache"; // در صورت نیاز برای آپدیت کش

type CreateIntermediateTableResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      message?: string;
    };

export async function createIntermediateTable(
  categoryId: string,
  attributeIds: string[],
): Promise<CreateIntermediateTableResult> {
  if (!categoryId) {
    return {
      success: false,
      message: "شناسه دسته‌بندی معتبر نمی‌باشد.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.categoryAttribute.deleteMany({
        where: {
          categoryId,
        },
      });
      if (attributeIds && attributeIds.length > 0) {
        await tx.categoryAttribute.createMany({
          data: attributeIds.map((attributeId) => ({
            categoryId,
            attributeId,
          })),
          skipDuplicates: true,
        });
      }
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error linking category attributes:", error);
    return {
      success: false,
      message: "خطا در برقراری ارتباط ویژگی‌ها با دسته‌بندی.",
    };
  }
}
