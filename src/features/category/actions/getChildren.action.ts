"use server";
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
  try {
    // استفاده از Recursive CTE برای پیدا کردن تمام فرزندان
    const result = (await prisma.$queryRaw`
      WITH RECURSIVE category_tree AS (
        SELECT id FROM "Category" WHERE id = ${id}
        UNION ALL
        SELECT c.id FROM "Category" c
        INNER JOIN category_tree ct ON c."parentId" = ct.id
      )
      SELECT id FROM category_tree;
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
