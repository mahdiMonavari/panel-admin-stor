"use client";
import AddNewCategory from "./AddNewCategory";

import { FaArrowRight, FaPlus } from "react-icons/fa";
import Link from "next/link";
import CategoryTree from "./CategoryTree";
import { Prisma } from "@/generated/prisma/client";
import NavyButton from "@/src/components/navyButton/NavyButton";
import { useState } from "react";
export type categories = Prisma.CategoryGetPayload<{
  include: {
    children: true;
  };
}>;

const CategoryLayout = ({ categories }: { categories: categories[] }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  console.log(categories);

  return (
    <div>
      <div
        className="flex flex-wrap items-center justify-between gap-4 relative z-30
       rounded-2xl border border-slate-200/80 bg-white/60 p-4 mb-6
        shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/panel-admin/categories"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-teal-500 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
            title="بازگشت"
          >
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>
      <NavyButton
        text="ایجاد دسته بندی جدید"
        onClick={() => setIsAddOpen(true)}
        Icon={<FaPlus />}
      />
      <AddNewCategory
        isAddOpen={isAddOpen}
        setIsAddOpen={setIsAddOpen}
        id={null}
        title="ایجاد دسته بندی والد"
      />
      <div className="mt-6">
        <CategoryTree
          categories={categories}
          onEdit={(cat) => console.log("ویرایش", cat)}
          onDelete={(cat) => console.log("حذف", cat)}
          onAddChild={async (parentId, name) => {
            // اینجا API رو صدا بزن (POST categories)
          }}
        />
      </div>
    </div>
  );
};
export default CategoryLayout;
