"use client";

import { useState } from "react";
import { FaArrowRight, FaEyeSlash } from "react-icons/fa";
import SortSelect from "@/src/components/sortSelect/SortSelect";
import AddNewAttrebute from "./AddNewAttrebute";
import { AttributeSortConfig } from "../type/attributeFilter.type";
import { ORDER_OPTIONS } from "../../user/components/UsersLayout";
import SearchInput from "@/src/components/searchInput/SearchInput";
import { AttributeItemWithRelations } from "../query/getAttribut.query";
import AttributeCard from "./AttributeCard";
import Link from "next/link";

type AttrebuteLayoutProps = {
  attrebutes: AttributeItemWithRelations[];
  totla: number;
};

export default function AttrebuteLayout({
  attrebutes,
  totla,
}: AttrebuteLayoutProps) {
  const [error, setError] = useState<string | null>(null);

  const sortEntries = Object.entries(AttributeSortConfig);
  const sortOptions = sortEntries.map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* هدر: فیلترها، سورت و دکمه افزودن */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/panel-admin/categories"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-teal-500 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
            title="بازگشت"
          >
            <FaArrowRight className="text-sm" />
          </Link>
          <SortSelect options={sortOptions} queryKey="sort" />
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
          <span className="rounded-md bg-rose-500/10 px-3 py-1 text-xs text-rose-600 border border-rose-500/20">
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
          {attrebutes.map((attr) => (
            <AttributeCard key={attr.id} attr={attr} onError={setError} />
          ))}
        </div>
      )}
    </div>
  );
}
