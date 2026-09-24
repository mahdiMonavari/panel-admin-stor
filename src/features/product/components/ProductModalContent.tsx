import Modal from "@/src/components/modal/Modal";
import React, { useState } from "react";
import { FormProvider, useFormContext, UseFormReturn } from "react-hook-form";
import SelectCategory from "./SelectCategory";
import FillAttributeValue, { AttributeItem } from "./FillAttributeValue";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import { createProductType } from "../type/product.type";
import { CategoryWithRelations } from "../../category/type/category.type";

type ProductModalContentType = {
  categories: CategoryWithRelations[];
  attributes: AttributeItem[];
  error: null | string | undefined;
  startCreateProduct: (data: createProductType) => void;
  methode: UseFormReturn<createProductType, any, createProductType>;
  isOpen: boolean;
  setIsOpen: () => void;
};

function ProductModalContent({
  categories,
  attributes,
  error,
  startCreateProduct,
  methode,
  isOpen,
  setIsOpen,
}: ProductModalContentType) {
  console.log(isOpen);

  const [step, setStep] = useState<1 | 2>(1);
  const { handleSubmit, trigger } = useFormContext<createProductType>();
  const nextHandler = async () => {
    const isValid = await trigger(["categoryId", "description", "name"]);
    if (isValid) {
      setStep(2);
    }
  };
  const prevHandler = () => setStep(1);
  return (
    <Modal open={isOpen} setClose={setIsOpen} showFooter={false}>
      <div className="flex items-center justify-between">
        <h2 className="md:text-2xl  font-Morabba-Bold text-slate-800 dark:text-slate-200 mb-3">
          ایجاد محصول جدید
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
          {/* برچسب مرحله جاری */}
          <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {step}
            </span>
            <span className="mx-0.5 text-slate-300 dark:text-slate-600">/</span>
            2
          </span>
        </div>
      </div>
      {error ? (
        <span>{error}</span>
      ) : (
        <FormProvider {...methode}>
          {step === 1 ? (
            <SelectCategory categories={categories} />
          ) : (
            <FillAttributeValue attributes={attributes} />
          )}
        </FormProvider>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
        {/* دکمه مرحله قبلی */}
        <button
          type="button"
          onClick={prevHandler}
          disabled={step === 1}
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
            onClick={handleSubmit(startCreateProduct)}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all
                 bg-teal-600 hover:bg-teal-700 active:scale-95 
                 dark:bg-teal-500 dark:hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/20"
          >
            <HiCheck className="w-4 h-4" />
            <span>تایید و ثبت محصول</span>
          </button>
        )}
      </div>
    </Modal>
  );
}

export default ProductModalContent;
