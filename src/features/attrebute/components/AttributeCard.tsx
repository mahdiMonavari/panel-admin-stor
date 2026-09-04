"use client";

import { useTransition } from "react";
import Link from "next/link";
import { FaTrash, FaFolder, FaTags, FaArrowLeft } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import { AttributeItemWithRelations } from "../query/getAttribut.query";
import { deleteAttribute } from "../actions/attribute.delete";

// استایل و برچسب‌های هر تایپ ویژگی
const TYPE_BADGES: Record<string, { label: string; className: string }> = {
  TEXT: {
    label: "متنی",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  COLOR: {
    label: "رنگ",
    className:
      "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
  SELECT: {
    label: "انتخابی",
    className:
      "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
  NUMBER: {
    label: "عدد",
    className:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  },
};

type AttributeCardProps = {
  attr: AttributeItemWithRelations;
  onError?: (err: string | null) => void;
};

export default function AttributeCard({ attr, onError }: AttributeCardProps) {
  const [isPending, startTransition] = useTransition();

  const isVariable = attr.type === "COLOR" || attr.type === "SELECT";
  const hasCategories = attr.categories.length > 0;
  const hasValues = attr.values.length > 0;
  const isDeletable = !hasCategories && !hasValues;

  const badge = TYPE_BADGES[attr.type] || {
    label: attr.type,
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  const displayedValues = attr.values.slice(0, 10);
  const extraValuesCount = Math.max(0, attr.values.length - 10);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onError?.(null);

    startTransition(async () => {
      const res = await deleteAttribute(attr.id);
      if (!res.success && res.errorMessage) {
        onError?.(res.errorMessage);
      }
    });
  };

  // محتوای داخلی کارت
  const cardContent = (
    <>
      {/* لودر اختصاصی کارت */}
      {isPending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-neutral-900/40 backdrop-blur-xs">
          <RingLoader color="#14b8a6" loading size={60} speedMultiplier={1} />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* بخش بالا: نام، نوع و دکمه حذف */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h4 className="text-base font-bold text-slate-800 transition-colors group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-400">
                {attr.label || attr.name}
              </h4>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                نام سیستم: {attr.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${badge.className}`}
              >
                {badge.label}
              </span>

              {/* دکمه حذف */}
              {isDeletable && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-90 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                  title="حذف ویژگی"
                >
                  <FaTrash className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* بخش میانی: دسته‌بندی‌های متصل */}
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <FaFolder className="text-teal-500" />
            <span>دسته‌بندی‌های متصل:</span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {attr.categories.length} دسته
            </span>
          </div>

          {/* نمایش مقادیر */}
          {isVariable ? (
            <div className="mt-3 flex flex-col gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <FaTags className="text-slate-400" />
                <span>مقادیر ثبت‌شده ({attr.values.length}):</span>
              </div>
              {attr.values.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {displayedValues.map((val) => (
                    <span
                      key={val.id}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200/70 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {val.code && (
                        <span
                          className="h-2 w-2 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: val.code }}
                        />
                      )}
                      {val.label || val.value}
                    </span>
                  ))}

                  {extraValuesCount > 0 && (
                    <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                      +{extraValuesCount} بیشتر
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[11px] italic text-slate-400 dark:text-slate-500">
                  هنوز مقداری ثبت نشده است
                </span>
              )}
            </div>
          ) : (
            <div className="mt-6 flex items-center justify-center border-t border-slate-100 pt-4 dark:border-slate-800/80">
              <span className="font-Morabba-Bold text-xs text-rose-400">
                این ویژگی نیازی به تعریف مقادیر ندارد
              </span>
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-teal-600 transition-colors group-hover:text-teal-700 dark:border-slate-800 dark:text-teal-400 dark:group-hover:text-teal-300">
          <span>
            {isVariable ? "مدیریت مقادیر و دسته‌ها" : "مشاهده دسته ها"}
          </span>
          <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
        </div>
      </div>
    </>
  );

  const containerClasses = `group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 ${
    isPending
      ? "pointer-events-none opacity-80"
      : "hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/5 dark:hover:border-teal-400/40"
  }`;

  return (
    <Link
      href={`/panel-admin/categories/attrebute/${attr.id}`}
      className={containerClasses}
    >
      {cardContent}
    </Link>
  );
}
