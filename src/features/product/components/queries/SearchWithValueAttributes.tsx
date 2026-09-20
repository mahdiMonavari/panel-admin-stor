"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import getAttributeValueWithCategoryIds from "@/src/features/attrebute/actions/attributeValue.getByCategories";

// تایپ داده بر اساس خروجی اکشن شما
export interface AttributeItem {
  id: string;
  name: string;
  label: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  values: {
    id: string;
    label: string;
    value: string;
    code?: string | null;
  }[];
}

function SearchWithValueAttributes() {
  const router = useRouter();
  const pathname = usePathname();
  const queries = useSearchParams();
  const searchParams = queries.get("categories");

  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!searchParams) {
      setAttributes([]);
      return;
    }

    startTransition(async () => {
      await new Promise((res) => setTimeout(res, 1000));
      setError(null);
      const res = await getAttributeValueWithCategoryIds(searchParams);
      if (!res.success) {
        setError(res.message);
        return;
      }
      setAttributes(res.data as unknown as AttributeItem[]);
    });
  }, [searchParams]);

  const handleCheckboxChange = (attributeName: string, val: string) => {
    const params = new URLSearchParams(queries.toString());
    const currentValues = params.get(attributeName)?.split(",") || [];

    let updatedValues: string[];
    if (currentValues.includes(val)) {
      updatedValues = currentValues.filter((item) => item !== val);
    } else {
      updatedValues = [...currentValues, val];
    }

    if (updatedValues.length > 0) {
      params.set(attributeName, updatedValues.join(","));
    } else {
      params.delete(attributeName);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!searchParams) return null;

  return (
    <div className="relative z-20 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        {isPending ? (
          <span className="flex h-6 w-6 items-center justify-center text-teal-600 dark:text-teal-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        ) : (
          <div className="flex items-center gap-2.5 font-medium text-slate-800 dark:text-slate-200">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-teal-500 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? "بستن فیلترها" : "بازکردن فیلترها"}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  expanded ? "rotate-0" : "-rotate-90 rtl:rotate-90"
                }`}
              />
            </button>
            <span>فیلترهای پیشرفته</span>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-500 dark:text-rose-400">{error}</p>
      )}

      {/* بخش آکاردئونی مقادیر */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-4 flex flex-col divide-y divide-slate-100 dark:divide-slate-800/80">
            {attributes.length === 0 && !isPending && (
              <p className="py-2 text-center text-xs text-slate-400">
                ویژگی خاصی برای این دسته‌بندی یافت نشد.
              </p>
            )}

            {attributes.map((attr) => {
              const selectedValues =
                queries.get(attr.name.toLowerCase())?.split(",") || [];

              return (
                <div key={attr.id} className="py-3 first:pt-0 last:pb-0">
                  <span className="mb-2.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {attr.label || attr.name}
                  </span>

                  {/* لیست مقادیر (چک‌باکس‌ها یا دکمه‌های رنگ) */}
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((v) => {
                      const isSelected = selectedValues.includes(v.value);

                      return (
                        <label
                          key={v.id}
                          className={`group flex cursor-pointer select-none items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                            isSelected
                              ? "border-teal-500 bg-teal-50/70 font-semibold text-teal-700 shadow-xs dark:border-teal-500 dark:bg-teal-950/30 dark:text-teal-300"
                              : "border-slate-200/80 bg-white/50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:border-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleCheckboxChange(
                                attr.name.toLowerCase(),
                                v.value,
                              )
                            }
                            className="hidden"
                          />

                          {/* نمایش دایره رنگ در صورتی که ویژگی رنگی باشد (code داشته باشد) */}
                          {v.code && (
                            <span
                              className="h-3 w-3 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: v.code }}
                            />
                          )}

                          <span>{v.label || v.value}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchWithValueAttributes;
