"use client";

import Link from "next/link";
import {
  FaTrash,
  FaFolder,
  FaTags,
  FaArrowLeft,
  FaEyeSlash,
} from "react-icons/fa";
import SortSelect from "@/src/components/sortSelect/SortSelect";
import AddNewAttrebute from "./AddNewAttrebute";
import { AttributeSortConfig } from "../type/attributeFilter.type";
import { ORDER_OPTIONS } from "../../user/components/UsersLayout";
import SearchInput from "@/src/components/searchInput/SearchInput";
import { AttributeItemWithRelations } from "../query/getAttribut.query";
import { useState, useTransition } from "react";
import { RingLoader } from "react-spinners";
import { deleteAttribute } from "../actions/attribute.delete";

type AttrebuteLayoutPrps = {
  attrebutes: AttributeItemWithRelations[];
  totla: number;
};

// نگاشت تایپ‌های انگلیسی به برچسب‌های فارسی و استایل تگ
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

function AttrebuteLayout({ attrebutes, totla }: AttrebuteLayoutPrps) {
  const [isPending, startTransition] = useTransition();
  const [id, setId] = useState<string | null>(null);
  const [error, setError] = useState<null | string>(null);
  const sortEntries = Object.entries(AttributeSortConfig);

  const options = sortEntries.map(([value, label]) => ({
    value,
    label,
  }));

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setId(id);
    startTransition(async () => {
      const res = await deleteAttribute(id);
      if (!res.success) {
        setError(res.errorMessage as string);
      }
      setId(null);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* هدر: فیلترها، سورت و دکمه افزودن */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border relative z-30
       border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60"
      >
        <div className="flex flex-wrap items-center gap-3">
          <SortSelect options={options} queryKey="sort" />
          <SortSelect options={ORDER_OPTIONS} queryKey="order" />
        </div>
        <div className="flex items-center gap-3">
          <SearchInput />
          <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:inline-block">
            مجموع:{" "}
            <b className="font-bold text-slate-800 dark:text-slate-200">
              {totla}
            </b>{" "}
            ویژگی
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AddNewAttrebute />
        {error && (
          <span className="bg-rose-600/30 mt-5 px-3 py-1 text-rose-900 rounded-md block">
            {error}
          </span>
        )}
      </div>
      {attrebutes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-800">
          <FaEyeSlash className="text-3xl text-slate-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            هیچ ویژگی‌ای یافت نشد.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {attrebutes.map((attr) => {
            const hasCategories = attr.categories.length > 0;
            const hasValues = attr.values.length > 0;
            const isDeletable = !hasCategories && !hasValues;

            const badge = TYPE_BADGES[attr.type] || {
              label: attr.type,
              className:
                "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
            };

            const displayedValues = attr.values.slice(0, 10);
            const extraValuesCount = attr.values.length - 10;

            return (
              <Link
                key={attr.id}
                href={`/panel-admin/categories/attrebute/${attr.id}`}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300                 
                 ${isPending ? "cursor-auto" : "dark:hover:border-teal-400/40 hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/5 group"}
                  dark:border-slate-800 dark:bg-slate-900`}
              >
                {id === attr.id && isPending && (
                  <div className="bg-neutral-900/30 absolute inset-0 rounded flex items-center justify-center">
                    <RingLoader
                      color="#00598a"
                      loading
                      size={75}
                      speedMultiplier={1}
                    />
                  </div>
                )}
                <div>
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

                        {/* دکمه حذف فقط زمانی که نه دسته‌ای دارد و نه مقداری */}
                        {isDeletable && (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, attr.id)}
                            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-90 dark:text-slate-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                            title="حذف ویژگی"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* بخش میانی: تعداد دسته‌بندی‌های استفاده شده */}
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <FaFolder className="text-teal-500" />
                      <span>دسته‌بندی‌های متصل:</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {attr.categories.length} دسته
                      </span>
                    </div>

                    {/* نمایش مقادیر (حداکثر ۱۰ مورد) */}
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
                              {/* اگر مقدار کد رنگی داشت پیش‌نمایش دایره‌ای رنگ نشان داده شود */}
                              {val.code && (
                                <span
                                  className="h-2 w-2 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: val.code }}
                                />
                              )}
                              {val.label || val.value}
                            </span>
                          ))}

                          {/* نشان‌دهنده تعداد مقادیر باقی‌مانده بیشتر از ۱۰ */}
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
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-teal-600 transition-colors group-hover:text-teal-700 dark:border-slate-800 dark:text-teal-400 dark:group-hover:text-teal-300">
                    <span>مدیریت مقادیر و دسته‌ها</span>
                    <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AttrebuteLayout;
