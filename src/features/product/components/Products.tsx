import Link from "next/link";
import {
  MdInventory2,
  MdCalendarToday,
  MdLocalOffer,
  MdStar,
  MdCircle,
} from "react-icons/md";
import { HiTag, HiSparkles } from "react-icons/hi2";
import { TbPackages } from "react-icons/tb";
import getProducts from "../query/get.action";
import { ProductFilterType } from "../shema/productFilter";

type ProductsProps = {
  filterParams: ProductFilterType;
};

function getPriceRange(variants: any[]): { min: number; max: number } | null {
  const prices = variants
    .filter((v) => !v.deletedAt && v.price != null)
    .map((v) => Number(v.price));
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

function getVariantBadges(variants: any[]): string[] {
  return variants
    .filter((v) => !v.deletedAt)
    .map((v) =>
      (v.values as any[])
        .map((val) => val.attributeValue?.label ?? "")
        .filter(Boolean)
        .join(" / "),
    )
    .filter(Boolean);
}

function getMaxDiscount(variants: any[]): number | null {
  const discounts = variants
    .filter((v) => !v.deletedAt && v.discountPercent != null)
    .map((v) => Number(v.discountPercent));
  if (discounts.length === 0) return null;
  const max = Math.max(...discounts);
  return max > 0 ? max : null;
}

async function Products({ filterParams }: ProductsProps) {
  const result = await getProducts(filterParams);

  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-60 gap-3 text-slate-400 dark:text-slate-500">
        <TbPackages size={48} className="opacity-40" />
        <p className="text-sm">محصولی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
      {result.data.map((product: any) => {
        const priceRange = getPriceRange(product.variants ?? []);
        const badges = getVariantBadges(product.variants ?? []);
        const maxDiscount = getMaxDiscount(product.variants ?? []);
        const isActive = product.isActive;

        const jalaliDate = new Date(product.createdAt).toLocaleDateString(
          "fa-IR",
          { year: "numeric", month: "long", day: "numeric" },
        );

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block group outline-none"
          >
            <article
              className={`
                relative flex flex-col h-full rounded-2xl overflow-hidden
                border border-slate-200/70 dark:border-slate-700/60
                bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
                shadow-sm shadow-slate-200/50 dark:shadow-slate-950/40
                transition-all duration-200
                group-hover:-translate-y-0.5
                group-hover:shadow-md group-hover:shadow-slate-200/60 dark:group-hover:shadow-slate-950/60
                group-hover:border-violet-300/60 dark:group-hover:border-violet-700/50
                group-focus-visible:ring-2 group-focus-visible:ring-violet-500 group-focus-visible:ring-offset-2
                ${!isActive ? "opacity-50 grayscale-[40%]" : ""}
              `}
            >
              {/* نوار رنگی بالا */}
              <div
                className={`h-1 w-full ${
                  isActive
                    ? "bg-gradient-to-l from-violet-500 via-fuchsia-500 to-pink-500"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              />

              {/* بج تخفیف */}
              {maxDiscount !== null && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-rose-500 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-sm shadow-rose-500/30">
                  <HiSparkles size={11} />
                  <span>{maxDiscount}٪ تخفیف</span>
                </div>
              )}

              <div className="flex flex-col flex-1 p-4 gap-3">
                {/* هدر: دسته‌بندی و وضعیت */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-violet-600 dark:text-violet-400 font-medium bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 rounded-full border border-violet-200/60 dark:border-violet-800/50">
                    <HiTag size={11} />
                    <span>{product.category?.name ?? "—"}</span>
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50"
                        : "text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <MdCircle size={7} />
                    <span>{isActive ? "فعال" : "غیرفعال"}</span>
                  </div>
                </div>

                {/* نام محصول */}
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-1">
                  {product.name}
                </h3>

                {/* توضیحات */}
                {product.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-5 line-clamp-2 flex-shrink-0">
                    {product.description}
                  </p>
                )}

                {/* بج‌های ورینت */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {badges.slice(0, 4).map((badge, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md
                          bg-slate-100 dark:bg-slate-800
                          text-slate-600 dark:text-slate-300
                          border border-slate-200/80 dark:border-slate-700/60"
                      >
                        <MdLocalOffer size={9} className="text-violet-400" />
                        {badge}
                      </span>
                    ))}
                    {badges.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
                        +{badges.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* فوتر کارت */}
                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  {/* موجودی و قیمت */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <MdInventory2
                        size={13}
                        className="text-slate-400 dark:text-slate-500"
                      />
                      <span>
                        {new Intl.NumberFormat("fa-IR").format(
                          product.totalStock,
                        )}
                        <span className="mr-0.5 text-[10px]">عدد</span>
                      </span>
                    </div>

                    {priceRange ? (
                      <div className="text-[11px] font-bold text-violet-600 dark:text-violet-400 tabular-nums">
                        {priceRange.min === priceRange.max ? (
                          <span>{formatPrice(priceRange.min)} ت</span>
                        ) : (
                          <span>
                            {formatPrice(priceRange.min)}
                            <span className="mx-0.5 font-normal opacity-60">
                              —
                            </span>
                            {formatPrice(priceRange.max)} ت
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        قیمت ندارد
                      </span>
                    )}
                  </div>

                  {/* تاریخ */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-600">
                    <MdCalendarToday size={11} />
                    <span>{jalaliDate}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}

export default Products;
