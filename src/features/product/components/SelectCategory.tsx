"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  HiOutlineExclamationTriangle,
  HiArrowLeft,
  HiChevronLeft,
  HiXMark,
} from "react-icons/hi2";
import {
  CategoryTreeNodeType,
  CategoryWithRelations,
} from "../../category/type/category.type";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { createProductType } from "../type/product.type";
import { createProductInput } from "./inputs/create";
import Input from "@/src/components/input/Input";

const getCategoryChildren = (
  id: string,
  map: Map<string, CategoryTreeNodeType>,
): CategoryTreeNodeType[] => {
  const result: CategoryTreeNodeType[] = [];
  for (const [, value] of map) {
    if (value.parentId === id) {
      result.push(value);
    }
  }
  return result;
};

const getCategoryPath = (
  id: string,
  map: Map<string, CategoryTreeNodeType>,
): string[] => {
  const path: string[] = [];
  let currentId: string | undefined = id;

  while (currentId) {
    const node = map.get(currentId);
    if (node) {
      path.push(node.name);
      currentId = node.parentId ?? undefined;
    } else {
      break;
    }
  }

  return path.reverse();
};

type SelectCategoryProps = {
  categories: CategoryWithRelations[];
  onSelect?: (categoryId: string) => void;
  register: UseFormRegister<createProductType>;
  handleSubmit: UseFormHandleSubmit<createProductType>;
  errors: FieldErrors<createProductType>;
  setValue: UseFormSetValue<createProductType>;
};

export default function SelectCategory({
  categories,
  onSelect,
  errors,
  handleSubmit,
  register,
  setValue,
}: SelectCategoryProps) {
  const [currentCategoryId, setCurrentCategoryId] = useState("");
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryTreeNodeType>();
    categories.forEach((category) => {
      map.set(category.id, {
        ...category,
        attributes: category.attributes || [],
        children: [],
      });
    });
    return map;
  }, [categories]);

  const children = useMemo(() => {
    if (!currentCategoryId) return [];
    return getCategoryChildren(currentCategoryId, categoryMap);
  }, [currentCategoryId, categoryMap]);

  const path = useMemo(() => {
    if (!currentCategoryId) return [];
    return getCategoryPath(currentCategoryId, categoryMap);
  }, [currentCategoryId, categoryMap]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = useMemo(() => {
    const query = input.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((cate) => cate.name.toLowerCase().includes(query));
  }, [categories, input]);

  const handleSelectCategory = (
    cate: CategoryWithRelations | CategoryTreeNodeType,
  ) => {
    setInput(cate.name);
    setCurrentCategoryId(cate.id);
    setIsOpen(false);

    const directChildren = getCategoryChildren(cate.id, categoryMap);

    if (directChildren.length === 0) {
      setValue("categoryId", cate.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      onSelect?.(cate.id);
    } else {
      setValue("categoryId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleClear = () => {
    setInput("");
    setCurrentCategoryId("");
    setValue("categoryId", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full space-y-4" ref={wrapperRef}>
      {/* تیتر و راهنما */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
          دسته‌بندی کالا <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          دسته‌بندی نهایی مورد نظر را جستجو یا انتخاب کنید.
        </span>
      </div>

      {/* اینپوت سرچ دسته‌بندی */}
      <div className="relative">
        <input
          type="text"
          onChange={(e) => {
            setInput(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          value={input}
          placeholder="جستجو در دسته‌بندی‌ها..."
          className={`w-full rounded-xl border px-4 py-3 pl-10 text-sm outline-none transition-all placeholder:text-slate-400 shadow-xs
            ${
              errors.categoryId && !currentCategoryId
                ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-rose-900/60 dark:bg-rose-950/20"
                : "border-slate-200 bg-slate-50/70 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-900 dark:focus:ring-teal-400/10"
            }`}
        />

        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        )}

        {isOpen && (
          <ul className="absolute z-30 top-full mt-2 w-full max-h-60 overflow-y-auto rounded-xl bg-white shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 py-1.5 divide-y divide-slate-100/70 dark:divide-slate-800/60">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cate) => (
                <li
                  key={cate.id}
                  onClick={() => handleSelectCategory(cate)}
                  className="px-4 py-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200 
                             hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300 
                             transition-colors flex items-center justify-between"
                >
                  <span>{cate.name}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-center text-sm text-slate-400 dark:text-slate-500">
                دسته‌بندی با این عنوان یافت نشد
              </li>
            )}
          </ul>
        )}
      </div>

      {errors.categoryId && !currentCategoryId && (
        <span className="block text-xs font-medium text-rose-500 dark:text-rose-400">
          {"انتخاب دسته‌بندی کالا الزامی است"}
        </span>
      )}

      {path.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap rounded-lg bg-slate-100/70 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
          <span className="font-semibold text-slate-400 dark:text-slate-500">
            مسیر انتخابی:
          </span>
          {path.map((item, index) => (
            <React.Fragment key={index}>
              <span
                className={
                  index === path.length - 1
                    ? "font-bold text-teal-600 dark:text-teal-400"
                    : ""
                }
              >
                {item}
              </span>
              {index < path.length - 1 && (
                <HiChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {children.length > 0 && (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            <HiOutlineExclamationTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              این دسته‌بندی دارای زیرمجموعه است؛ لطفاً یکی از زیردسته‌ها را
              انتخاب کنید:
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            {children.map((cate) => (
              <button
                type="button"
                key={cate.id}
                onClick={() => handleSelectCategory(cate)}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium 
                           bg-white border border-slate-200 text-slate-700 shadow-2xs
                           hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 
                           dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 
                           dark:hover:border-teal-400 dark:hover:text-teal-300 dark:hover:bg-slate-800/80
                           transition-all active:scale-95 cursor-pointer"
              >
                <span>{cate.name}</span>
                <HiArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* سایر فیلدهای فرم */}
      <form className="mt-4 space-y-3">
        {createProductInput.map((inputItem) =>
          inputItem.type === "text" ? (
            <Input
              key={inputItem.name}
              errors={errors}
              label={inputItem.label}
              name={inputItem.name}
              placeholder={inputItem.placeholder}
              register={register}
            />
          ) : (
            <div key={inputItem.name} className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                {inputItem.label}
              </label>
              <textarea
                {...register(inputItem.name)}
                placeholder={inputItem.placeholder}
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm
                         text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500
                          focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-900/60
                           dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-900
                            dark:focus:ring-teal-400/10"
              />
              {errors[inputItem.name] && (
                <span className="text-xs font-medium text-rose-500 dark:text-rose-400">
                  {errors[inputItem.name]?.message as string}
                </span>
              )}
            </div>
          ),
        )}
      </form>
    </div>
  );
}
