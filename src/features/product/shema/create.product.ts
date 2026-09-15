import z from "zod";
import { AttributeItem } from "../components/FillAttributeValue";
import { ProductAttributes } from "../type/product.type";

export const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "نام محصول باید حداقل ۳ کاراکتر باشد" })
    .max(40, "نام محصول باید حداکثر 40 کاراکتر باشد"),
  description: z
    .string()
    .trim()
    .min(3, { message: "توضیحات کوتاه محصول باید حداقل ۳ کاراکتر باشد" })
    .max(40, "توضیحات کوتاه محصول باید حداکثر 40 کاراکتر باشد"),
  categoryId: z.string().uuid(),
});

export const createAttributesSchema = (
  attributes: AttributeItem[],
): z.ZodType<ProductAttributes, ProductAttributes> => {
  console.log(attributes);

  const shape: Record<string, z.ZodType> = {};
  attributes.forEach((attribute) => {
    switch (attribute.type) {
      case "TEXT":
        shape[attribute.id] = z
          .string()
          .min(1, `${attribute.label} الزامی است`);
        break;
      case "SELECT":
        shape[attribute.id] = z
          .array(z.string(), {
            error: `برای ${attribute.label} حداقل یک مورد انتخاب کنید`,
          })
          .min(1, `برای ${attribute.label} حداقل یک مورد انتخاب کنید`);
        break;
      case "NUMBER":
        shape[attribute.id] = z.coerce.number({
          error: `${attribute.label} الزامی است`,
        });
        break;
      default:
        break;
    }
  });
  return z.object(shape) as z.ZodType<ProductAttributes, ProductAttributes>;
};
