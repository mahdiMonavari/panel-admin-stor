"use server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";

type getChildrenCategoriesResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      data: string[];
    };

export default async function getChildrenCategories(
  id: string,
): Promise<getChildrenCategoriesResult> {
  const ids = id
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return {
      success: true,
      data: [],
    };
  }

  try {
    // استفاده از Recursive CTE برای پیدا کردن تمام فرزندان یک یا چند دسته‌بندی
    const result = (await prisma.$queryRaw`
      WITH RECURSIVE category_tree AS (
        SELECT id FROM "Category" WHERE id IN (${Prisma.join(ids)})
        UNION ALL
        SELECT c.id FROM "Category" c
        INNER JOIN category_tree ct ON c."parentId" = ct.id
      )
      SELECT DISTINCT id FROM category_tree;
    `) as { id: string }[];

    return {
      success: true,
      data: result.map((item) => item.id),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "خطا از سمت سرور دوباره تلاش کنید",
    };
  }
}
