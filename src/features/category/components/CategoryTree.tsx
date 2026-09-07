"use client";

import { useMemo } from "react";
import CategoryTreeNode from "./CategoryTreeNode";

export interface CategoryFlat {
  id: string;
  name: string;
  parentId: string | null;
}

export interface CategoryNode extends CategoryFlat {
  children: CategoryNode[];
}

function buildCategoryTree(categories: CategoryFlat[]): CategoryNode[] {
  const nodeMap = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  categories.forEach((category) => {
    nodeMap.set(category.id, { ...category, children: [] });
  });

  categories.forEach((category) => {
    const node = nodeMap.get(category.id)!;
    const parent = category.parentId
      ? nodeMap.get(category.parentId)
      : undefined;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

interface CategoryTreeProps {
  categories: CategoryFlat[];
}

const CategoryTree = ({ categories, onEdit, onDelete }: CategoryTreeProps) => {
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

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
