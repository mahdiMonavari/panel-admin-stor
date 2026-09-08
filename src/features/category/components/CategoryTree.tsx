import { useMemo } from "react";
import CategoryTreeNode from "./CategoryTreeNode";

import { CategoryWithRelations } from "../type/category.type";
import { createCategoryTree } from "@/src/lib/utiles/createRoot";

interface CategoryTreeProps {
  categories: CategoryWithRelations[];
}

const CategoryTree = ({ categories }: CategoryTreeProps) => {
  const tree = useMemo(() => createCategoryTree(categories), [categories]);

  return (
    <ul
      className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white/60 p-4
     shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60"
    >
      {tree.map((category) => (
        <CategoryTreeNode key={category.id} category={category} depth={0} />
      ))}
    </ul>
  );
};

export default CategoryTree;
