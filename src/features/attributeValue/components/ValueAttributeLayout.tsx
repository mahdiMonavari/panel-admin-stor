import SortSelect from "@/src/components/sortSelect/SortSelect";
import getAttributeValue from "../query/getAttributeValue";
import {
  attributeValueSortConfig,
  FilterAttributeValueType,
} from "../type/attributeValueFilters.type";
import AddNewValue from "./AddNewValue";
import { ORDER_OPTIONS } from "../../user/components/UsersLayout";
import { FaTrash } from "react-icons/fa";

async function ValueAttributeLayout({
  queries,
  id,
}: {
  queries: Partial<FilterAttributeValueType>;
  id: string;
}) {
  const attributeValue = await getAttributeValue(queries, id);
  const sortOptions = Object.entries(attributeValueSortConfig).map(
    ([value, label]) => ({ value, label }),
  );

  if (!attributeValue.success) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 text-center text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
        خطا در دریافت اطلاعات مقادیر مشخصه‌ها
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* فیلترها و مرتب‌سازی */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <SortSelect options={sortOptions} queryKey="sort" />
          <SortSelect options={ORDER_OPTIONS} queryKey="order" />
        </div>
      </div>

      {/* بخش افزودن مقدار جدید */}
      <div>
        <AddNewValue />
      </div>

      {/* لیست کارت‌های مینیمال */}
      {attributeValue.attributeValues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          هیچ مقداری یافت نشد.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {attributeValue.attributeValues.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-2.5 min-w-30
              rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs relative
              transition-all duration-200 hover:border-slate-300 hover:shadow-md overflow-hidden
               dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* دایره پیش‌نمایش رنگ هگز در صورت وجود */}
                {item.code && (
                  <span
                    className="size-4 shrink-0 rounded-full border border-black/10 shadow-xs dark:border-white/10"
                    style={{ backgroundColor: item.code }}
                    title={item.code}
                  />
                )}

                {/* عنوان مقدار */}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.value}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.label}
                </span>
                <span
                  className="absolute size-7 top-1/2 -translate-y-1/2 right-full bg-rose-600/50 rounded-full dark:text-black
                 group-hover:translate-x-8 transition-all duration-300 flex items-center justify-center text-white hover:cursor-pointer hover:scale-110"
                >
                  <FaTrash />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValueAttributeLayout;
