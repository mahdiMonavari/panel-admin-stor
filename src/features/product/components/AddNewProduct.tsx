"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus } from "react-icons/fa";
import NavyButton from "@/src/components/navyButton/NavyButton";
import ProductModalContent from "./ProductModalContent";
import { AttributeItem } from "./FillAttributeValue";
import { CategoryWithRelations } from "../../category/type/category.type";
import { createProductType } from "../type/product.type";
import {
  createAttributesSchema,
  productBaseSchema,
} from "../shema/create.product";
import { GetAttributesByCategoryId } from "../../attrebute/actions/attributesById.get";
import { createProduct } from "../action/create.action";

type AddProductProp = {
  categories: CategoryWithRelations[];
};

export default function AddNewProduct({ categories }: AddProductProp) {
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
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      attributes: {},
    },
  });

  const { watch, reset } = methods;
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (!categoryId) {
      setAttributes([]);
      return;
    }

    setError(null);
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
        if (!res.success) {
          setError(res.message || "خطا در دریافت ویژگی‌ها");
          return;
        }

        if (res.attributes) {
          setAttributes(res.attributes);
        }
      } catch {
        setError("مشکلی در برقراری ارتباط با سرور رخ داد");
      }
    });
  }, [categoryId, categories]);

  const handleCreateProduct = (data: createProductType) => {
    startTransition(async () => {
      const res = await createProduct(data, attributes);
      if (!res.success) {
        setError(res.message);
        return;
      }
      reset();
      setIsOpen(false);
    });
  };

  return (
    <>
      <NavyButton
        text="ساخت محصول جدید"
        onClick={() => setIsOpen(true)}
        Icon={<FaPlus />}
      />

      <FormProvider {...methods}>
        <ProductModalContent
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="ایجاد محصول جدید"
          submitButtonText="تایید و ثبت محصول"
          categories={categories}
          attributes={attributes}
          isPending={isPending}
          error={error}
          onSubmit={handleCreateProduct}
        />
      </FormProvider>
    </>
  );
}
