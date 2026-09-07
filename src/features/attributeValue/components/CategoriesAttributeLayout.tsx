import React from "react";
import Link from "next/link";
import { FolderTree, Tag, AlertCircle } from "lucide-react";
import getCategories from "../../category/query/categories.get";

interface CategoriesAttributeLayoutProps {
  params: string; // شناسه ویژگی (attributeId)
}

export default async function CategoriesAttributeLayout({
  params,
}: CategoriesAttributeLayoutProps) {
  const res = await getCategories(params);

  // حالت بروز خطا
  if (!res.success) {
    return (
      <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{res.message}</span>
      </div>
    );
  }

  const categories = res.data;

  return (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      {/* هدر بخش */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <FolderTree className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-semibold">دسته‌بندی‌های متصل</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
          {categories.length} دسته
        </span>
      </div>

      {/* لیست بج‌ها */}
      {categories.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 py-2">
          این ویژگی در هیچ دسته‌بندی‌ای استفاده نشده است.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((category) => (
            <span
              key={category.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                         bg-teal-50 text-teal-700 border border-teal-200/60
                         dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/50
                         transition-all hover:bg-teal-100 dark:hover:bg-teal-900/50 cursor-default"
            >
              <Tag className="w-3 h-3 text-teal-500 dark:text-teal-400 shrink-0" />
              <span>{category.name}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
