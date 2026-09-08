"use server";
import { prisma } from "@/src/lib/prisma";
import { CategoryWithRelations } from "../type/category.type";

// ۲. تایپ ساده
export type CategorySimple = {
  id: string;
  name: string;
};

// ۳. تعریف انواع خروجی
type GetCategoriesFullResult =
  | { success: true; data: CategoryWithRelations[] }
  | { success: false; message: string };

type GetCategoriesSimpleResult =
  | { success: true; data: CategorySimple[] }
  | { success: false; message: string };

// ۴. امضای توابع (Overloads)
export default async function getCategories(): Promise<GetCategoriesFullResult>;
export default async function getCategories(
  id: string,
): Promise<GetCategoriesSimpleResult>;

// ۵. پیاده‌سازی اصلی تابع
export default async function getCategories(
  id?: string,
): Promise<GetCategoriesFullResult | GetCategoriesSimpleResult> {
  try {
    if (id) {
      const categories = await prisma.category.findMany({
        where: {
          attributes: {
            some: {
              attributeId: id,
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return {
        success: true,
        data: categories,
      };
    }

    const allCategories = await prisma.category.findMany({
      include: {
        attributes: true,
        children: true,
      },
    });

    return {
      success: true,
      data: allCategories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message: "خطا در دریافت اطلاعات دسته‌بندی‌ها",
    };
  }
}
