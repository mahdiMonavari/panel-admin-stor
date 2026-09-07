import { ChevronDown, Pencil, Trash, FolderPlus } from "lucide-react";
import AddNewCategory from "./AddNewCategory";
import { useState } from "react";
import { CategoryNode } from "./CategoryTree";
import IconButton from "./IconButton";
import AddNewAtribute from "./AddNewAtribute";

interface CategoryTreeNodeProps {
  category: CategoryNode;
  depth: number;
}

const CategoryTreeNode = ({ category, depth }: CategoryTreeNodeProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const hasChildren = category.children.length > 0;

  return (
    <li>
      <div
        className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-transparent transition-all duration-200 hover:border-slate-200 hover:bg-white dark:hover:border-slate-800 dark:hover:bg-slate-800/80"
        style={{ marginInlineStart: depth ? `${depth * 1.5}rem` : 0 }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {hasChildren ? (
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-teal-500 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? "بستن زیرمجموعه" : "بازکردن زیرمجموعه"}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  expanded ? "" : "-rotate-90 rtl:rotate-90"
                }`}
              />
            </button>
          ) : (
            <span className="w-7" aria-hidden="true" />
          )}

          <span
            className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate"
            title={category.name}
          >
            {category.name}
          </span>
          {hasChildren && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              ({category.children.length})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <IconButton
            title="افزودن زیرکتگوری"
            onClick={() => setIsAddOpen((prev) => !prev)}
          >
            <FolderPlus className="h-4 w-4" />
          </IconButton>
          <AddNewAtribute id={category.id} title={category.name} />

          {/* <IconButton
            title="حذف"
            variant="danger"
            onClick={() => onDelete?.(category.id)}
          >
            <Trash className="h-4 w-4" />
          </IconButton> */}
        </div>
      </div>

      <AddNewCategory
        isAddOpen={isAddOpen}
        setIsAddOpen={setIsAddOpen}
        id={category.id}
        title={`ایجاد زیر مجموعه برای ${category.name}`}
      />

      {hasChildren && (
        <div
          className={`grid transition-all duration-300 ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="flex flex-col gap-2 mt-1">
              {category.children.map((child) => (
                <CategoryTreeNode
                  key={child.id}
                  category={child}
                  depth={depth + 1}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export default CategoryTreeNode;
