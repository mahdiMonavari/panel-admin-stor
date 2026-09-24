import Image from "next/image";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineClipboardDocument,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineTag,
  HiOutlineRectangleStack,
} from "react-icons/hi2";

import { SerializedProduct } from "../../action/getSingleProduct.action";
import DeleteSingleProduct from "./DeleteSingleProduct";

type Props = {
  product: SerializedProduct;
  id: string;
};

export default function SingleProductAdmin({ product, id }: Props) {
  const toFa = (num: number | string) => Number(num).toLocaleString("fa-IR");

  return (
    <div className="max-w-7xl mx-auto space-y-10 dir-rtl text-slate-700 dark:text-slate-200">
      {/* سربرگ ادمین - زیباتر */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-neutral-800 flex-shrink-0">
            <Image
              src={product.variants[0]?.img || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <HiOutlineTag className="w-3.5 h-3.5" />
                {product.category?.name || "بدون دسته"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                {toFa(product.totalStock)} عدد در انبار
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
                  product.isActive
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    : "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                }`}
              >
                {product.isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>
          </div>
        </div>

        {/* اکشن‌های محصول */}
        <div className="flex gap-2 flex-wrap">
          {/* <button
            onClick={() => onToggleActive?.(product.id, product.isActive)}
            className="px-5 py-2.5 text-sm font-medium rounded-2xl border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 active:scale-[0.985] transition-all"
          >
            {product.isActive ? "غیرفعال کردن" : "فعال کردن"}
          </button> */}
          <button className="px-5 py-2.5 text-sm font-medium rounded-2xl bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.985] transition-all">
            ویرایش محصول
          </button>
          <DeleteSingleProduct
            id={id}
            productName={product.name}
            variants={product.variants}
          />
        </div>
      </div>

      {/* بخش واریانت‌ها - کارت‌ها */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HiOutlineRectangleStack className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              انواع گونها
            </h2>
          </div>
          <span className="text-sm font-semibold px-4 py-1.5 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
            {toFa(product.variants.length)} گونه
          </span>
        </div>

        {product.variants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {product.variants.map((variant) => {
              const isAvailable = variant.stock && variant.stock > 0;
              const discount = variant.discountPercent
                ? Number(variant.discountPercent)
                : 0;
              const finalPrice = discount
                ? Math.round(Number(variant.price) * (1 - discount / 100))
                : Number(variant.price);

              return (
                <div
                  key={variant.id}
                  className="group bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* تصویر واریانت */}
                  <div className="relative h-48 bg-slate-100 dark:bg-neutral-950">
                    <Image
                      src={variant.img || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <div className="absolute top-4 right-4 px-3 py-1 text-xs font-bold bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl shadow">
                        ٪{toFa(discount)} تخفیف
                      </div>
                    )}
                  </div>

                  {/* محتوای کارت */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* ویژگی‌ها */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {variant.values.map((v) => (
                        <span
                          key={v.attributeValueId}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800"
                        >
                          {v.attributeValue?.code && (
                            <span
                              className="w-3 h-3 rounded-full border border-black/10"
                              style={{ backgroundColor: v.attributeValue.code }}
                            />
                          )}
                          {v.attributeValue?.label}
                        </span>
                      ))}
                    </div>

                    {/* قیمت و موجودی */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                          {toFa(finalPrice)}
                        </span>
                        <span className="text-xs text-slate-500">تومان</span>
                      </div>

                      {discount > 0 && (
                        <div className="text-xs text-slate-400 line-through">
                          {toFa(String(variant.price))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div
                          className={`flex items-center gap-2 text-sm font-medium ${
                            isAvailable
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current" />
                          {toFa(variant.stock || 0)} عدد
                        </div>

                        <div>
                          {variant.deletedAt ? (
                            <span className="text-xs px-3 py-1 rounded-2xl bg-slate-100 dark:bg-neutral-800 text-slate-500">
                              حذف‌شده
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-2xl border ${
                                variant.isActive
                                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200"
                                  : "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200"
                              }`}
                            >
                              <HiOutlineEye className="w-3.5 h-3.5" />
                              {variant.isActive ? "فعال" : "غیرفعال"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-neutral-800 p-4 flex gap-2 bg-slate-50/50 dark:bg-neutral-950/50">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 hover:bg-violet-50 hover:border-violet-200 active:scale-[0.985] transition-all">
                      <HiOutlinePencilSquare className="w-4 h-4" /> ویرایش
                    </button>
                    {variant.isActive && (
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 hover:bg-amber-50 hover:border-amber-200 active:scale-[0.985] transition-all">
                        <HiOutlineEyeSlash className="w-4 h-4" /> غیرفعال
                      </button>
                    )}
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-2xl text-rose-600 hover:bg-rose-50 border border-rose-200 active:scale-[0.985] transition-all">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-neutral-800">
            <HiOutlineClipboardDocument className="w-12 h-12 text-slate-300 dark:text-neutral-700" />
            <p className="text-slate-500">
              هیچ تنوعی برای این محصول تعریف نشده است.
            </p>
          </div>
        )}
      </div>

      {product.staticAttributes && product.staticAttributes.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-sm">
          <h3 className="font-extrabold text-xl mb-5 text-slate-900 dark:text-white">
            مشخصات فنی کلی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.staticAttributes.map((attr) => (
              <div
                key={attr.id}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800"
              >
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {attr.attribute?.label}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
