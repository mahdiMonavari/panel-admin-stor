import { CategoryTreeItem } from "@/src/features/category/actions/generateIntermediateTabel";
import { CategoryWithRelations } from "@/src/features/category/type/category.type";

export const createCategoryTree = (categories: CategoryWithRelations[]) => {
  const map = new Map<string, CategoryTreeItem>();
  const roots: CategoryTreeItem[] = [];
  for (const item of categories) {
    map.set(item.id, { ...item, children: [] });
  }
  for (const item of categories) {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else if (!item.parentId) {
      roots.push(node);
    }
  }
  return roots;
};
