"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache"; // در صورت نیاز برای آپدیت کش
import getCategories from "../query/categories.get";
import { CategoryWithRelations } from "../type/category.type";
import { createCategoryTree } from "@/src/lib/utiles/utiles";

export type CategoryTreeItem = CategoryWithRelations & {
  children: CategoryTreeItem[];
};

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
  const res = await getCategories();
  if (!res.success) {
    return {
      success: false,
      message: "خطای ناشناخته دوباره تلاش کنید",
    };
  }
  //   console.log(res.data);

  const tree = createCategoryTree(res.data);
  return {
    success: true,
    data: tree,
  };
  return {
    success: false,
    message: "عدم آپدیت",
  };
  //   try {
  //     await prisma.$transaction(async (tx) => {
  //       await tx.categoryAttribute.deleteMany({
  //         where: {
  //           categoryId,
  //         },
  //       });
  //       if (attributeIds && attributeIds.length > 0) {
  //         await tx.categoryAttribute.createMany({
  //           data: attributeIds.map((attributeId) => ({
  //             categoryId,
  //             attributeId,
  //           })),
  //           skipDuplicates: true,
  //         });
  //       }
  //     });
  //     revalidatePath("/panel-admin/categories/category");
  //     return {
  //       success: true,
  //     };
  //   } catch (error) {
  //     console.error("Error linking category attributes:", error);
  //     return {
  //       success: false,
  //       message: "خطا در برقراری ارتباط ویژگی‌ها با دسته‌بندی.",
  //     };
  //   }
}
