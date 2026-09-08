import { CategoryTreeNodeType } from "@/src/features/category/type/category.type";

export default function findRootArray(
  currentId: string,
  categories: CategoryTreeNodeType[],
  path: CategoryTreeNodeType[] = [],
): CategoryTreeNodeType[] {
  for (const item of categories) {
    // مسیر فعلی به همراه خود آیتم
    const currentPath = [...path, item];

    // اگر آیتم مورد نظر پیدا شد، کل مسیر از ریشه تا این نود را برگردان
    if (item.id === currentId) {
      return currentPath;
    }

    // اگر فرزند داشت، جستجو را در فرزندان ادامه بده
    if (item.children && item.children.length > 0) {
      const found = findRootArray(currentId, item.children, currentPath);
      if (found.length > 0) {
        return found;
      }
    }
  }

  return [];
}
