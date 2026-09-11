import SortSelect from "@/src/components/sortSelect/SortSelect";

import { ORDER_OPTIONS } from "../../user/components/UsersLayout";
import AddNewProduct from "./AddNewProduct";
import { CategoryWithRelations } from "../../category/type/category.type";

type ProductLayoutProp = {
  categories: CategoryWithRelations[];
};

function ProductLayout({ categories }: ProductLayoutProp) {
  return (
    <div className="space-y-5">
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <SortSelect options={ORDER_OPTIONS} queryKey="order" />
        </div>
      </div>
      <AddNewProduct categories={categories} />
    </div>
  );
}

export default ProductLayout;
