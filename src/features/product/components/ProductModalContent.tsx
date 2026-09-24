"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import Modal from "@/src/components/modal/Modal";
import SelectCategory from "./SelectCategory";
import FillAttributeValue, { AttributeItem } from "./FillAttributeValue";
import { CategoryWithRelations } from "../../category/type/category.type";
import { createProductType } from "../type/product.type";

type ProductModalContentProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitButtonText?: string;
  categories: CategoryWithRelations[];
  attributes: AttributeItem[];
  isPending?: boolean;
  error?: string | null;
  onSubmit: (data: createProductType) => void;
};

export default function ProductModalContent({
  isOpen,
  onClose,
  title,
  submitButtonText = "تایید و ثبت نهایی",
  categories,
  attributes,
  isPending = false,
  error,
  onSubmit,
}: ProductModalContentProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const { handleSubmit, trigger } = useFormContext<createProductType>();

  const nextHandler = async () => {
    const isValid = await trigger(["categoryId", "description", "name"]);
    if (isValid) {
      setStep(2);
    }
  };

  const prevHandler = () => setStep(1);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Modal open={isOpen} setClose={handleClose} showFooter={false}>
      {/* هدر مودال و گام‌شمار */}
      <div className="flex items-center justify-between">
        <h2 className="md:text-2xl font-Morabba-Bold text-slate-800 dark:text-slate-200 mb-3">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative h-2 w-12 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-800">
            <div className="h-full w-full rounded-full bg-linear-to-l from-teal-400 to-teal-600 shadow-sm transition-all duration-500" />
          </div>

          <div className="relative h-2 w-12 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-800">
            <div
              className={`h-full rounded-full bg-linear-to-l from-teal-400 to-teal-600 shadow-sm transition-all duration-500 ease-out ${
                step >= 2 ? "w-full" : "w-0"
              }`}
            />
          </div>
          <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {step}
            </span>
            <span className="mx-0.5 text-slate-300 dark:text-slate-600">/</span>
            2
          </span>
        </div>
      </div>

      {error && (
        <div className="my-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
          {error}
        </div>
      )}

      {/* محتوای مراحل */}
      <div className="mt-3">
        {step === 1 ? (
          <SelectCategory categories={categories} />
        ) : (
          <FillAttributeValue attributes={attributes} />
        )}
      </div>

      {/* دکمه‌های کنترل مراحل */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
        <button
          type="button"
          onClick={prevHandler}
          disabled={step === 1 || isPending}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
               border border-slate-200 bg-white text-slate-700 shadow-xs
               hover:bg-slate-50 hover:text-slate-900 active:scale-95
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white
               disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-900 disabled:active:scale-100"
        >
          <HiArrowRight className="w-4 h-4" />
          <span>مرحله قبلی</span>
        </button>

        {step === 1 ? (
          <button
            type="button"
            onClick={nextHandler}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all
                 bg-teal-600 hover:bg-teal-700 active:scale-95 
                 dark:bg-teal-500 dark:hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/20"
          >
            <span>مرحله بعدی</span>
            <HiArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all
                 bg-teal-600 hover:bg-teal-700 active:scale-95 
                 dark:bg-teal-500 dark:hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/20
                 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiCheck className="w-4 h-4" />
            <span>{isPending ? "در حال ذخیره..." : submitButtonText}</span>
          </button>
        )}
      </div>
    </Modal>
  );
}
