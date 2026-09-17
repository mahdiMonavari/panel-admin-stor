"use client";
import NavyButton from "@/src/components/navyButton/NavyButton";
import { CategoryWithRelations } from "../../category/type/category.type";
import { useEffect, useMemo, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/src/components/modal/Modal";
import SelectCategory from "./SelectCategory";
import FillAttributeValue, {
  AttributeItem,
  SelectedAttributesState,
} from "./FillAttributeValue";
import { FormProvider, useForm } from "react-hook-form";
import { createProductType } from "../type/product.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import {
  createAttributesSchema,
  productBaseSchema,
} from "../shema/create.product";
import { GetAttributesByCategoryId } from "../../attrebute/actions/attributesById.get";
import { createProduct } from "../action/create.action";

type AddProductProp = {
  categories: CategoryWithRelations[];
};

function AddNewProduct({ categories }: AddProductProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>();
  const ProductSchema = useMemo(() => {
    return productBaseSchema.extend({
      attributes: createAttributesSchema(attributes),
    });
  }, [attributes]);
  const methode = useForm<createProductType>({
    resolver: zodResolver(ProductSchema),
    mode: "onTouched",
  });
  const {
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = methode;
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (!categoryId) return;
    setError(null);
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
  const nextHandler = async () => {
    const isValid = await trigger(["categoryId", "description", "name"]);
    if (isValid) {
      setStep(2);
    }
  };
  const prevHandler = () => setStep(1);
  const startCreateProduct = (data: createProductType) => {
    startTransition(async () => {
      const res = await createProduct(data, attributes);
      if (!res.success) {
        setError(res.message);
        return;
      }
      setIsOpen(false);
    });
  };

  return (
    <>
      <div>
        <NavyButton
          text="ساخت محصول جدید"
          onClick={() => setIsOpen(true)}
          Icon={<FaPlus />}
        />
      </div>
      <Modal open={isOpen} setClose={() => setIsOpen(false)} showFooter={false}>
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
              <span className="mx-0.5 text-slate-300 dark:text-slate-600">
                /
              </span>
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
    </>
  );
}

export default AddNewProduct;
