import React from "react";
import { FolderTree, Tag, AlertCircle, GitBranch } from "lucide-react";
import getCategories from "../../category/query/categories.get";

interface CategoriesAttributeLayoutProps {
  params: string; // شناسه ویژگی (attributeId)
}

export default async function CategoriesAttributeLayout({
  params: attributeId,
}: CategoriesAttributeLayoutProps) {
  // ۱. دریافت کل دسته‌بندی‌ها به همراه مشخصات و روابط
  const res = await getCategories();

  if (!res.success) {
    return (
      <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{res.message}</span>
      </div>
    );
  }

  const allCategories = res.data;

  // ۲. پیدا کردن شناسه دسته‌هایی که مستقیم به این ویژگی متصل هستند
  const directCategoryIds = new Set(
    allCategories
      .filter((cat) =>
        cat.attributes.some((attr) => attr.attributeId === attributeId),
      )
      .map((cat) => cat.id),
  );

  // ۳. نقشه دسته‌بندی‌ها برای دسترسی سریع به والدها O(1)
  const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

  // ۴. جداسازی دسته‌ها به دو گروه «مستقیم» و «ارث‌بری شده»
  const directCategories: typeof allCategories = [];
  const inheritedCategories: typeof allCategories = [];

  for (const cat of allCategories) {
    // اگر خودش مستقیم متصل باشد
    if (directCategoryIds.has(cat.id)) {
      directCategories.push(cat);
      continue;
    }

    // بررسی اینکه آیا یکی از والدهای این دسته به ویژگی متصل است یا خیر
    let currentParentId = cat.parentId;
    let isInherited = false;

    while (currentParentId) {
      if (directCategoryIds.has(currentParentId)) {
        isInherited = true;
        break;
      }
      const parentNode = categoryMap.get(currentParentId);
      currentParentId = parentNode ? parentNode.parentId : null;
    }

    if (isInherited) {
      inheritedCategories.push(cat);
    }
  }

  const totalConnectedCount =
    directCategories.length + inheritedCategories.length;

  return (
    <div className="flex flex-col gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* هدر بخش */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
          <FolderTree className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span className="text-base font-bold">دسته‌بندی‌های متصل</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200/50 dark:border-teal-800/40">
          مجموعاً {totalConnectedCount} دسته
        </span>
      </div>

      {totalConnectedCount === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 py-2">
          این ویژگی هنوز به هیچ دسته‌بندی‌ای متصل نشده است.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {/* ۱. دسته‌بندی‌های مستقیم (اصلی) */}
          {directCategories.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                اتصال مستقیم ({directCategories.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {directCategories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl 
                               bg-teal-500/10 text-teal-700 border border-teal-500/30
                               dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/40"
                  >
                    <Tag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{category.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ۲. دسته‌بندی‌های ارث‌بری شده (فرزندان) */}
          {inheritedCategories.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                ارث‌بری شده از والد ({inheritedCategories.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {inheritedCategories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal rounded-lg 
                               bg-slate-100 text-slate-600 border border-slate-200/80
                               dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60 opacity-90"
                    title={`این دسته ویژگی را از والد خود ارث برده است`}
                  >
                    <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{category.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
