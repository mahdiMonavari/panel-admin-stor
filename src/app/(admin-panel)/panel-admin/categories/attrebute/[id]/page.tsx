import Link from "next/link";
import {
  FaArrowRight,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { getAttribute } from "@/src/features/attrebute/actions/attribute.get";
import CategoriesAttributeLayout from "@/src/features/attributeValue/components/CategoriesAttributeLayout";
import ValueAttributeLayout from "@/src/features/attributeValue/components/ValueAttributeLayout";
import { FilterAttributeValueType } from "@/src/features/attributeValue/type/attributeValueFilters.type";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Partial<FilterAttributeValueType>>;
};

// نگاشت تایپ‌های ویژگی به عنوان‌های فارسی و رنگ
const TYPE_BADGES: Record<string, { label: string; className: string }> = {
  TEXT: {
    label: "متنی",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  COLOR: {
    label: "رنگ",
    className:
      "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
  SELECT: {
    label: "انتخابی",
    className:
      "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
  NUMBER: {
    label: "عددی",
    className:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  },
};

async function Page({ params, searchParams }: PageProps) {
  const queryParamers = await searchParams;
  const { id } = await params;
  const attributeRes = await getAttribute(id);

  if (!attributeRes.success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="flex container flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center backdrop-blur-md dark:border-rose-900/50 dark:bg-rose-950/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
            <FaExclamationCircle className="text-2xl" />
          </div>
          <div>
            <h3 className="font-Morabba-Bold text-lg text-slate-800 dark:text-slate-100">
              خطا در دریافت اطلاعات
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {attributeRes.message || "ویژگی مورد نظر یافت نشد."}
            </p>
          </div>
          <Link
            href="/panel-admin/categories/attrebute"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <FaArrowRight className="text-xs" />
            <span>بازگشت به لیست ویژگی‌ها</span>
          </Link>
        </div>
      </div>
    );
  }

  const { attribute } = attributeRes;
  const isVariable = attribute.type === "COLOR" || attribute.type === "SELECT";
  const badge = TYPE_BADGES[attribute.type] || {
    label: attribute.type,
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8 sm:p-6 lg:p-8">
      {/* هدر صفحه: دکمه بازگشت و اطلاعات ویژگی */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border
       border-slate-200/80 bg-white/70 px-4 py-3 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/panel-admin/categories/attrebute"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-teal-500 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
            title="بازگشت"
          >
            <FaArrowRight className="text-sm" />
          </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-Morabba-Bold text-xl font-bold text-slate-900 dark:text-white">
                {attribute.label || attribute.name}
              </h1>
              <span
                className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-2">
              نام سیستمی:{" "}
              <span className="font-mono text-slate-600 dark:text-slate-300">
                {attribute.name}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* بخش مدیریت دسته‌بندی‌های متصل */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <CategoriesAttributeLayout />
      </section>

      {/* بخش مقادیر ویژگی */}
      {isVariable ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <ValueAttributeLayout queries={queryParamers} />
        </section>
      ) : (
        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-amber-800 dark:border-amber-400/20 dark:bg-amber-950/20 dark:text-amber-300">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
            <FaInfoCircle className="text-lg" />
          </div>
          <div>
            <h4 className="font-Morabba-Bold text-sm font-bold">
              عدم نیاز به تعریف مقادیر
            </h4>
            <p className="mt-0.5 text-sm opacity-90">
              این ویژگی از نوع <b className="font-semibold">{badge.label}</b>{" "}
              است و مقادیر آن به صورت دستی توسط ادمین در زمان ایجاد محصول تایین
              میشود
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
