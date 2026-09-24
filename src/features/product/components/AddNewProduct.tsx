"use client";
import NavyButton from "@/src/components/navyButton/NavyButton";
import { CategoryWithRelations } from "../../category/type/category.type";
import { useEffect, useMemo, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/src/components/modal/Modal";
import SelectCategory from "./SelectCategory";
import FillAttributeValue, {
  AttributeItem,
  SelectedAttributesState,
} from "./FillAttributeValue";
import { FormProvider, useForm } from "react-hook-form";
import { createProductType } from "../type/product.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import {
  createAttributesSchema,
  productBaseSchema,
} from "../shema/create.product";
import { GetAttributesByCategoryId } from "../../attrebute/actions/attributesById.get";
import { createProduct } from "../action/create.action";
import ProductModalContent from "./ProductModalContent";

type AddProductProp = {
  categories: CategoryWithRelations[];
};

function AddNewProduct({ categories }: AddProductProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>();
  const ProductSchema = useMemo(() => {
    return productBaseSchema.extend({
      attributes: createAttributesSchema(attributes),
    });
  }, [attributes]);
  const methode = useForm<createProductType>({
    resolver: zodResolver(ProductSchema),
    mode: "onTouched",
  });
  const {
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = methode;
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (!categoryId) return;
    setError(null);
    startTransition(async () => {
      try {
        const map = new Map<string, CategoryWithRelations>();
        categories.map((category) => map.set(category.id, category));
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
  }, [categoryId]);
  const nextHandler = async () => {
    const isValid = await trigger(["categoryId", "description", "name"]);
    if (isValid) {
      setStep(2);
    }
  };
  const prevHandler = () => setStep(1);
  const startCreateProduct = (data: createProductType) => {
    startTransition(async () => {
      const res = await createProduct(data, attributes);
      if (!res.success) {
        setError(res.message);
        return;
      }
      setIsOpen(false);
    });
  };

  return (
    <>
      <div>
        <NavyButton
          text="ساخت محصول جدید"
          onClick={() => setIsOpen(true)}
          Icon={<FaPlus />}
        />
      </div>
      <FormProvider {...methode}>
        <ProductModalContent
          categories={categories}
          attributes={attributes}
          error={error}
          startCreateProduct={startCreateProduct}
          methode={methode}
          isOpen={isOpen}
          setIsOpen={() => setIsOpen(!isOpen)}
        />
      </FormProvider>
    </>
  );
}

export default AddNewProduct;
