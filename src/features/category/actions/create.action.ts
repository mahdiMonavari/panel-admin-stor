"use server";
import { prisma } from "@/src/lib/prisma";
import CreateCategorySchema from "../schema/create.shema";
import { revalidatePath } from "next/cache";

type generateNewCategoryResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export default async function generateNewCategory(
  rowData: unknown,
): Promise<generateNewCategoryResult> {
  const parsed = CreateCategorySchema.safeParse(rowData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }
  const { name, parentId } = parsed.data;
  const category = await prisma.category.create({ data: { name, parentId } });
  if (!category) {
    return {
      success: false,
      message: "خطای ناشناخته دوباره تلاش کنید",
    };
  }
  revalidatePath("/panel-admin/categories/category");
  return {
    success: true,
  };
}
