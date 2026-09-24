"use server";

import { AttributeItem } from "../components/FillAttributeValue";
import {
  createAttributesSchema,
  productBaseSchema,
} from "../shema/create.product";

type updateProductResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
    };
export default async function updateProduct(
  id: string,
  rowDate: unknown,
  attributes: AttributeItem[],
): Promise<updateProductResult> {
  const productSchema = productBaseSchema.extend({
    attributes: createAttributesSchema(attributes),
  });
  const paresd = productSchema.safeParse(rowDate);
  if (!paresd.success) {
    return {
      success: false,
      message: "دیتای ورودی معتبر نمیباشد",
    };
  }

  console.log(rowDate);
  return {
    success: true,
  };
}
