"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import {
  Pencil,
  Check,
  Search,
  SlidersHorizontal,
  Palette,
  Hash,
  Type,
  ListFilter,
  AlertCircle,
} from "lucide-react";
import { FiLoader } from "react-icons/fi";
import Modal from "@/src/components/modal/Modal";
import IconButton from "./IconButton";
import { Prisma } from "@/generated/prisma/client";
import { getAttributes } from "../../attrebute/query/getAttribut.query";
import { AttrebuteEnum } from "../../attrebute/schema/createAttribute.schema";
import { createIntermediateTable } from "../actions/generateIntermediateTabel";
import { getSelectedAttributes } from "../actions/getAttributsCategory.action";

type AttributeType = (typeof AttrebuteEnum)[number];

interface TypeConfig {
  label: string;
  icon: React.ElementType;
  badge: string;
  activeBadge: string;
}

const TYPE_CONFIG: Record<AttributeType, TypeConfig> = {
  TEXT: {
    label: "متن",
    icon: Type,
    badge: "bg-blue-500/10 text-blue-900 dark:text-blue-400 border-blue-500/20",
    activeBadge: "bg-blue-500/20 text-blue-900 border-blue-400/30",
  },
  COLOR: {
    label: "رنگ",
    icon: Palette,
    badge: "bg-pink-500/10 text-pink-900 dark:text-pink-400 border-pink-500/20",
    activeBadge: "bg-pink-500/20 text-pink-900 border-pink-400/30",
  },
  SELECT: {
    label: "انتخابی",
    icon: ListFilter,
    badge: "bg-teal-500/10 text-teal-900 dark:text-teal-400 border-teal-500/20",
    activeBadge: "bg-teal-500/20 text-teal-900 border-teal-400/30",
  },
  NUMBER: {
    label: "عددی",
    icon: Hash,
    badge:
      "bg-amber-500/10 text-amber-900 dark:text-amber-400 border-amber-500/20",
    activeBadge: "bg-amber-500/20 text-amber-900 border-amber-400/30",
  },
};

type AddNewAttributeProps = {
  id: string;
  title: string;
};

export default function AddNewAtribute({ id, title }: AddNewAttributeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<
    Prisma.AttributeGetPayload<{}>[]
  >([]);

  useEffect(() => {
    setError(null);
    startTransition(async () => {
      const res = await getAttributes({});
      if (!res.success || !res.data) {
        return setError("خطا در دریافت لیست ویژگی‌ها");
      }
      setAttributes(res.data);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      startTransition(async () => {
        const res = await getSelectedAttributes(id);
        if (!res.success) {
          return setError(res.message as string);
        }
        if (res.success && res.data) {
          setSelected(res.data);
        }
      });
    }
  }, [isOpen]);

  // فیلتر جستجو بر اساس لیبل و نام فنی
  const filteredAttributes = useMemo(() => {
    if (!attributes) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return attributes;

    return attributes.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        (item as any).name?.toLowerCase().includes(query),
    );
  }, [attributes, searchQuery]);

  const toggleSelect = (attrId: string) => {
    setSelected((prev) =>
      prev.includes(attrId)
        ? prev.filter((i) => i !== attrId)
        : [...prev, attrId],
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredAttributes.length) {
      setSelected([]);
    } else {
      setSelected(filteredAttributes.map((attr) => attr.id));
    }
  };
  const handleSave = async () => {
    setIsSaving(true);
    const res = await createIntermediateTable(id, selected);
    if (!res.success) {
      return setError(res.message);
    }
    setIsOpen(false);
    setIsSaving(false);
  };

  return (
    <>
      <IconButton title="مدیریت ویژگی‌ها" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4" />
      </IconButton>

      <Modal open={isOpen} setClose={setIsOpen} showFooter={false}>
        <div className="w-full max-w-2xl flex flex-col gap-4 text-slate-800 dark:text-slate-100">
          {/* هدر مودال */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  انتخاب ویژگی‌های دسته‌بندی برای {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ویژگی‌های مورد نظر را برای اتصال به این دسته‌بندی تیک بزنید.
                </p>
              </div>
            </div>

            {attributes.length > 0 && !isPending && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {selected.length} از {attributes.length} انتخاب شده
              </span>
            )}
          </div>

          {/* نوار جستجو و ابزار انتخاب همگانی */}
          {!isPending && attributes.length > 0 && (
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجوی ویژگی بر اساس عنوان یا نام..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-9 pl-4 text-xs text-slate-900 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-900"
                />
              </div>

              <button
                type="button"
                onClick={toggleSelectAll}
                className="shrink-0 text-xs font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                {selected.length === filteredAttributes.length
                  ? "لغو انتخاب همه"
                  : "انتخاب همه"}
              </button>
            </div>
          )}

          {/* محتوا و گرید آیتم‌ها */}
          <div className="min-h-65 max-h-[50vh] overflow-y-auto px-0.5 py-1">
            {isPending ? (
              <div className="flex h-56 flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
                <FiLoader className="h-8 w-8 animate-spin text-teal-500" />
                <span className="text-sm font-medium">
                  در حال دریافت لیست ویژگی‌ها...
                </span>
              </div>
            ) : error ? (
              <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-red-200 bg-red-50/50 text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle className="h-6 w-6" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            ) : filteredAttributes.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
                <Search className="h-8 w-8 stroke-[1.5]" />
                <p className="text-xs">هیچ ویژگی‌ای با این عنوان یافت نشد.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-hidden">
                {filteredAttributes.map((item) => {
                  const isChecked = selected.includes(item.id);
                  const typeKey = (item.type as AttributeType) || "TEXT";
                  const currentType = TYPE_CONFIG[typeKey] || TYPE_CONFIG.TEXT;
                  const TypeIcon = currentType.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      className={`group relative flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition-all duration-200 select-none ${
                        isChecked
                          ? "border-teal-500 bg-teal-500/[0.07] shadow-sm shadow-teal-500/10 dark:border-teal-500/60 dark:bg-teal-500/10"
                          : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {/* محتوای چپ (چک‌باکس و مشخصات) */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* چک‌باکس سفارشی */}
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all duration-150 ${
                            isChecked
                              ? "border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-500"
                              : "border-slate-300 bg-white group-hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800"
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </div>

                        {/* عنوان و نام فنی */}
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isChecked
                                ? "text-teal-950 dark:text-teal-200"
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {item.label}
                          </span>
                          {(item as any).name && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-mono">
                              {(item as any).name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* بج نوع ویژگی */}
                      <div
                        className={`flex items-center gap-1 shrink-0 rounded-md border px-2 py-0.5 text-xs font-Morabba-Bold font-medium ${
                          isChecked
                            ? currentType.activeBadge
                            : currentType.badge
                        }`}
                      >
                        <TypeIcon className="h-3 w-3" />
                        <span>{currentType.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* فوتر مودال (اکشن‌ها) */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-200/80 pt-4 dark:border-slate-800">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              انصراف
            </button>
            <button
              type="button"
              disabled={isSaving || isPending}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-xs font-medium text-white shadow-md shadow-teal-500/20 transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              <span>ذخیره تغییرات ({selected.length})</span>
              {isSaving && <FiLoader className="h-3.5 w-3.5 animate-spin" />}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
