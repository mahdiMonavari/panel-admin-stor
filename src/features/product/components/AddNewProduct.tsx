"use client";
import NavyButton from "@/src/components/navyButton/NavyButton";
import { CategoryWithRelations } from "../../category/type/category.type";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/src/components/modal/Modal";
import SelectCategory from "./SelectCategory";
import FillAttributeValue from "./FillAttributeValue";

type AddProductProp = {
  categories: CategoryWithRelations[];
};

function AddNewProduct({ categories }: AddProductProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [categoryId, setCategoryId] = useState<null | string>();
  const [error, setError] = useState<string | null>();
  const nextHandler = () => setStep(2);
  const prevHandler = () => setStep(1);
  const onSelectCategoryId = (id: string) => setCategoryId(id);
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
          <h2 className="text-2xl font-Morabba-Bold text-slate-800 dark:text-slate-200 mb-3">
            ایجاد محصول جدید
          </h2>
          <div className="h-3 rounded-full w-20 bg-indigo-300 relative">
            <span
              className={`absolute right-0 top-0 h-full bg-indigo-600 rounded-full transition-all duration-300 ${step === 1 ? "w-1/2 " : "w-full"}`}
            ></span>
          </div>
        </div>
        {step === 1 ? (
          <SelectCategory
            categories={categories}
            onSelect={onSelectCategoryId}
          />
        ) : (
          <FillAttributeValue />
        )}
      </Modal>
    </>
  );
}

export default AddNewProduct;
