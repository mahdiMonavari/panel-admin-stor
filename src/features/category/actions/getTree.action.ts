"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";

type CategoryType = Prisma.CategoryGetPayload<{}>;
type getRootResult =
  | { success: false; message: string }
  | {
      success: true;
      data: CategoryType[];
    };

export default async function getRoot(id: string): Promise<getRootResult> {
  if (id === null) {
    return {
      success: false,
      message: "آیدی وارد شده صحیح نمیباشد",
    };
  }
  const root: CategoryType[] = [];
  const categories = await prisma.category.findMany();
  const mapCategories = new Map<string, CategoryType>();
  categories.map((cate) => mapCategories.set(cate.id, cate));
  let parentId = mapCategories.get(id)?.parentId;
  const current = mapCategories.get(id);
  if (current) {
    root.push(current);
  }
  while (parentId) {
    const current = mapCategories.get(parentId);
    if (current) {
      root.push(current);
      parentId = current.parentId;
    }
  }
  return {
    success: true,
    data: root,
  };
}
