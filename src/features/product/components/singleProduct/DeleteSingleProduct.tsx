"use client";

import Modal from "@/src/components/modal/Modal";
import { useState, useTransition } from "react";
import { ProductWithRelations } from "../../action/getSingleProduct.action";
import { FaArrowDown } from "react-icons/fa";
import { deleteSingleProductHandler } from "../../action/deleteSingleProduct.action";
import { useRouter } from "next/navigation";

function DeleteSingleProduct({
  id,
  productName,
  variants,
}: {
  id: string;
  productName: string;
  variants: Array<
    Omit<
      ProductWithRelations["variants"][number],
      "price" | "discountPercent"
    > & {
      price: number;
      discountPercent: number;
    }
  >;
}) {
  const [isOpen, setIsopen] = useState(false);
  const [error, setIsError] = useState<null | string>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handler = () => {
    startTransition(async () => {
      setIsError(null);
      const res = await deleteSingleProductHandler(id);
      if (!res.success) {
        setIsError(res.message);
        return;
      }
      router.push("/panel-admin/products");
    });
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setIsopen(true)}
        className="rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 active:scale-[0.98]"
      >
        حذف
      </button>

      <Modal
        open={isOpen}
        setClose={setIsopen}
        errorMessage={error}
        isLoading={isPending}
        title="حذف کامل محصول و تمامی انواع آن"
        onConfirm={handler}
      >
        <div dir="rtl" className="space-y-5 text-right">
          {/* باکس هشدار */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4">
            <p className="text-sm leading-7 text-rose-900">
              با حذف محصول
              <span className="mx-1 font-Morabba-Bold text-rose-600">
                {productName}
              </span>
              تمامی انواع آن نیز حذف می‌شوند.
            </p>
            <p className="mt-1 text-xs text-rose-500">
              این عملیات غیرقابل بازگشت است.
            </p>
          </div>

          {/* لیست واریانت‌ها */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <span>انواع محصول</span>
              <FaArrowDown className="text-xs text-zinc-400" />
              <span className="text-xs font-normal text-zinc-400">
                ({variants.length} مورد)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {variants.slice(0, 4).map((variant) =>
                variant.values.map((value) => (
                  <span
                    key={`${value.attributeValueId}-${value.productVariantId}`}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700"
                  >
                    {value.attributeValue.label}
                  </span>
                )),
              )}

              {variants.length > 4 && (
                <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
                  و {variants.length - 4} مورد دیگر
                </span>
              )}

              {variants.length === 0 && (
                <span className="text-xs text-zinc-400">
                  این محصول تنوعی ندارد.
                </span>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteSingleProduct;
