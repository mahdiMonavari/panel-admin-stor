"use server";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

type deleteAttributeResult =
  | {
      success: true;
    }
  | {
      success: false;
      errorMessage?: string;
    };

export async function deleteAttribute(
  id: string,
): Promise<deleteAttributeResult> {
  if (typeof id !== "string") {
    return {
      success: false,
      errorMessage: "id نامعتبر است",
    };
  }
  try {
    // حذف فقط و فقط در صورتی انجام می‌شود که نه دسته‌ای داشته باشد و نه مقداری
    const result = await prisma.attribute.deleteMany({
      where: {
        id: id,
        categories: {
          none: {}, // هیچ دسته‌بندی نداشته باشد (طولش ۰ باشد)
        },
        values: {
          none: {}, // هیچ مقداری هم نداشته باشد (طولش ۰ باشد)
        },
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        errorMessage:
          "امکان حذف وجود ندارد؛ این ویژگی دارای دسته‌بندی یا مقادیر ثبت‌شده است.",
      };
    }

    revalidatePath("/panel-admin/categories/attrebute");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: "خطایی در حذف ویژگی رخ داد.",
    };
  }
}
