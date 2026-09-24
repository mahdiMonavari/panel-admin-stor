"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiPencilSquare } from "react-icons/hi2";
import ProductModalContent from "../ProductModalContent";
import { AttributeItem } from "../FillAttributeValue";
import { CategoryWithRelations } from "@/src/features/category/type/category.type";
import { createProductType } from "../../type/product.type";
import { GetAttributesByCategoryId } from "@/src/features/attrebute/actions/attributesById.get";
import {
  createAttributesSchema,
  productBaseSchema,
} from "../../shema/create.product";
import { getSingleProduct } from "../../action/getSingleProduct.action";
import updateProduct from "../../action/update.action";

// import { getProductById, updateProduct } from ;

export type EditSingleProductProps = {
  id: string;
  productName: string;
  categories: CategoryWithRelations[];
};

export default function EditSingleProduct({
  id,
  productName,
  categories,
}: EditSingleProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const ProductSchema = useMemo(() => {
    return productBaseSchema.extend({
      attributes: createAttributesSchema(attributes),
    });
  }, [attributes]);

  const methods = useForm<createProductType>({
    resolver: zodResolver(ProductSchema),
    mode: "onTouched",
  });

  const { watch, reset } = methods;
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (!isOpen) return;

    startTransition(async () => {
      try {
        const res = await getSingleProduct(id);

        if (!res.success) {
          setError(res.message || "خطا در دریافت اطلاعات محصول");
        }
        if (res.success && res.data) {
          const formattedAttributes: Record<string, string | string[]> = {};

          res.data.variants.forEach((variant) => {
            variant.values.forEach((value) => {
              if (value.attributeValue) {
                const attrId = value.attributeValue.attributeId;
                const valId = value.attributeValue.id;

                const currentList = formattedAttributes[attrId] || [];
                if (!currentList.includes(valId)) {
                  formattedAttributes[attrId] = [...currentList, valId];
                }
              }
            });
          });
          res.data.staticAttributes.forEach((item) => {
            if (item.value) {
              formattedAttributes[item.attributeId] = item.value;
            }
          });

          reset({
            name: res.data.name,
            description: res.data.description || "",
            categoryId: res.data.categoryId,
            attributes: formattedAttributes,
          });
        }
      } catch {
        setError("مشکلی در دریافت دیتای محصول رخ داد");
      }
    });
  }, [isOpen, id, reset]);

  // دریافت ویژگی‌ها با تغییر دسته‌بندی
  useEffect(() => {
    if (!categoryId) {
      setAttributes([]);
      return;
    }

    startTransition(async () => {
      try {
        const map = new Map<string, CategoryWithRelations>();
        categories.forEach((cat) => map.set(cat.id, cat));
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
        if (res.success && res.attributes) {
          setAttributes(res.attributes);
        }
      } catch {
        setError("خطا در همگام‌سازی ویژگی‌های دسته‌بندی");
      }
    });
  }, [categoryId, categories]);

  const handleUpdateProduct = (data: createProductType) => {
    startTransition(async () => {
      const res = await updateProduct(id, data, attributes);
      //   if (!res.success) {
      //     setError(res.message);
      //     return;
      //   }
      //   setIsOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
      >
        <HiPencilSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span>ویرایش</span>
      </button>

      <FormProvider {...methods}>
        <ProductModalContent
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`ویرایش محصول: ${productName}`}
          submitButtonText="ذخیره تغییرات"
          categories={categories}
          attributes={attributes}
          isPending={isPending}
          error={error}
          onSubmit={handleUpdateProduct}
        />
      </FormProvider>
    </>
  );
}
