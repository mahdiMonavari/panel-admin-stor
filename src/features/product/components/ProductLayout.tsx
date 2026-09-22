import SortSelect from "@/src/components/sortSelect/SortSelect";

import { ORDER_OPTIONS } from "../../user/components/UsersLayout";
import AddNewProduct from "./AddNewProduct";
import { CategoryWithRelations } from "../../category/type/category.type";
import SearchInCategories from "./queries/SearchInCategories";
import SearchInput from "@/src/components/searchInput/SearchInput";
import SearchWithValueAttributes from "./queries/SearchWithValueAttributes";
import Products from "./Products";
import { ProductFilterType, sortFields } from "../shema/productFilter";
import RengePrice from "./queries/RengePrice";

type ProductLayoutProp = {
  categories: CategoryWithRelations[];
  filterParams: ProductFilterType;
};
const SORT_OPTION = Object.entries(sortFields).map(([value, label]) => ({
  value,
  label,
}));

function ProductLayout({ categories, filterParams }: ProductLayoutProp) {
  return (
    <div className="space-y-5 overflow-x-hidden overflow-y-clip">
      <div
        className="relative z-30 flex w-full flex-wrap items-center justify-between 
      gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4
       shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60"
      >
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          <SortSelect options={ORDER_OPTIONS} queryKey="order" />
          <SortSelect options={SORT_OPTION} queryKey="sort" />
          <div className="flex-1 min-w-50">
            {" "}
            <SearchInput
              placeholder="جستجو بر اساس نام محصول"
              queryKey="search"
            />
          </div>

          <SearchInCategories categories={categories} />
          <RengePrice />
        </div>
      </div>

      <SearchWithValueAttributes />
      <AddNewProduct categories={categories} />
      <h1 className="text-3xl text-slate-700 dark:text-slate-100 font-Morabba-Bold">
        محصولات فروشگاه
      </h1>
      <Products filterParams={filterParams} />
    </div>
  );
}

export default ProductLayout;
