"use client";

import React, { useEffect, useState, useTransition } from "react";
import { GetAttributesByCategoryId } from "../../attrebute/actions/attributesById.get";
import { ClipLoader } from "react-spinners";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { Prisma } from "@/generated/prisma/client";
import { CategoryWithRelations } from "../../category/type/category.type";
import { useFormContext } from "react-hook-form";
import { createProductType } from "../type/product.type";
import { register } from "module";

type AttributeItem = Prisma.AttributeGetPayload<{
  include: { values: true };
}>;

export type SelectedAttributesState = {
  [attributeId: string]: string | string[] | number;
};

interface FillAttributeValueProps {
  categoryId: string;
  categories: CategoryWithRelations[];
}

function FillAttributeValue({
  categoryId,
  categories,
}: FillAttributeValueProps) {
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const {
    setValue,
    formState: { errors },
    getValues,
    register,
  } = useFormContext<createProductType>();
  useEffect(() => {
    if (!categoryId) return;

    setError(null);
    console.log(getValues("attributes"));

    startTransition(async () => {
      try {
        const map = new Map<string, CategoryWithRelations>();
        categories.map((category) => map.set(category.id, category));
        const path: string[] = [];
        let currentId: string | undefined = categoryId;

        while (currentId) {
          const node = map.get(currentId);
          if (node) {
            path.push(node.id);
            currentId = node.parentId ?? undefined;
          } else {
            break;
          }
        }
        const res = await GetAttributesByCategoryId(path);

        if (!res.success) {
          setError(res.message || "خطا در دریافت ویژگی‌ها");
          return;
        }

        if (res.attributes) {
          setAttributes(res.attributes);
        }
      } catch {
        setError("مشکلی در برقراری ارتباط با سرور رخ داد");
      }
    });
  }, [categoryId]);

  const handleToggleSelectValue = (attributeId: string, valId: string) => {
    const prevAttributes = (getValues("attributes") || {}) as Record<
      string,
      string[]
    >;
    const currentValues = prevAttributes[attributeId] || [];

    // بررسی تکراری بودن جهت toggle
    const isSelected = currentValues.includes(valId);
    const updatedValues = isSelected
      ? currentValues.filter((id) => id !== valId)
      : [...currentValues, valId];

    // کپی سطحی تمیز برای پرهیز از mutate مستقیم
    const newAttributes = { ...prevAttributes };

    // اگر مقداری باقی نمونده بود، ویژگی کلاً حذف بشه؛ در غیر این صورت مقدار جدید بشینه
    if (updatedValues.length === 0) {
      delete newAttributes[attributeId];
    } else {
      newAttributes[attributeId] = updatedValues;
    }

    setValue("attributes", newAttributes, {
      shouldValidate: true,
      shouldDirty: true,
    });
    console.log(getValues("attributes"));
  };

  const handleInputChange = (attributeId: string, val: string) => {
    const prevAttributes = getValues("attributes") || {};
    setValue("attributes", { ...prevAttributes, [attributeId]: val });
    console.log(getValues("attributes"));
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
        <ClipLoader size={26} color="oklch(55% 0.18 250)" />
        <span className="text-sm">در حال بارگذاری ویژگی‌های دسته...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2.5 p-4 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm">
        <HiOutlineExclamationCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!attributes.length) {
    return (
      <div className="p-5 text-center text-sm text-slate-400">
        ویژگی‌ای برای این دسته‌بندی تعریف نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attr) => {
          const isSelectType = attr.type === "SELECT";
          return (
            <div
              key={attr.id}
              className="
                flex flex-col gap-3 p-4 rounded-2xl
                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-800
                max-h-56 overflow-y-auto
                scrollbar-thin scrollbar-thumb-slate-200
                dark:scrollbar-thumb-slate-700
              "
            >
              {/* هدر ویژگی */}
              <div
                className="
                  flex items-center justify-between gap-2
                  sticky top-0
                  bg-white dark:bg-slate-900
                  pb-1
                  border-b border-slate-100
                  dark:border-slate-800
                "
              >
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                  {attr.label}

                  <span className="text-xs text-slate-400 font-normal mr-1.5">
                    ({attr.name})
                  </span>
                </label>

                <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {isSelectType ? "چند گزینه‌ای" : attr.type}
                </span>
              </div>

              {/* بدنه ورودی */}
              {isSelectType ? (
                <div className="grid grid-cols-2 gap-1">
                  {attr.values && attr.values.length > 0 ? (
                    attr.values.map((item) => {
                      const x = getValues("attributes") as Record<
                        string,
                        string[]
                      >;
                      const isSelected = x[attr.id].includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            handleToggleSelectValue(attr.id, item.id)
                          }
                          className={`
                            flex items-center gap-1.5                            
                            text-xs px-3 py-1.5 rounded-lg
                            border-2 transition-all duration-150
                            active:scale-95
                            ${
                              isSelected
                                ? "border-violet-500 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40"
                                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-transparent hover:border-violet-300 dark:hover:border-violet-700"
                            }
                          `}
                        >
                          <span className="flex items-center gap-1">
                            <span className="text-[10px] font-Dana-Medium">
                              {item.label || item.value}
                            </span>
                            {item.code && (
                              <span
                                className={`size-3 rounded-full`}
                                style={{
                                  backgroundColor: item.code ?? "transparent",
                                }}
                              ></span>
                            )}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-amber-500 dark:text-amber-400">
                      گزینه‌ای برای انتخاب تعریف نشده است.
                    </span>
                  )}
                </div>
              ) : (
                <input
                  type={attr.type === "NUMBER" ? "number" : "text"}
                  {...register(`attributes.${attr.id}`)}
                  onChange={(e) => handleInputChange(attr.id, e.target.value)}
                  placeholder="مقدار را وارد کنید..."
                  className="
                    w-full text-sm px-3.5 py-2 rounded-xl
                    bg-slate-50 dark:bg-slate-800
                    border border-slate-200 dark:border-slate-700
                    text-slate-800 dark:text-slate-100
                    placeholder:text-slate-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-violet-400/25
                    focus:border-violet-400
                    transition
                  "
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FillAttributeValue;
