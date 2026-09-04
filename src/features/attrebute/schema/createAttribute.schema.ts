import z from "zod";
import { attributeValueItemSchema } from "./createAttrbuteValue.schema";
import categorySchema from "../../category/schema/category.shema";

export const AttrebuteEnum = ["TEXT", "COLOR", "SELECT", "NUMBER"] as const;
export type AttrebuteEnumType = typeof AttrebuteEnum;

export const createAttributeSchema = z.object({
  name: z
    .string()
    .min(1, "نام ویژگی الزامی است")
    .min(2, "نام ویژگی باید حداقل ۲ کاراکتر باشد")
    .regex(/^[A-Za-z]+$/, "نام ویژگی فقط باید شامل حروف انگلیسی باشد"),

  type: z.enum(AttrebuteEnum, "باید یکی از آیتمها را انتخاب کنید"),

  label: z
    .string()
    .min(1, "عنوان ویژگی الزامی است")
    .min(2, "عنوان ویژگی باید حداقل ۲ کاراکتر باشد"),

  values: z.array(attributeValueItemSchema).optional(),
});
