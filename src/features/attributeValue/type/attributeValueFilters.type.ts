import { filters } from "@/src/shema/global.schema";
import { z } from "zod";

export const attributeValueSortConfig = {
  createdAt: "تاریخ ایجاد",
  name: "بر اساس حروف الفبا",
} as const;

export type AttributeValueType = keyof typeof attributeValueSortConfig;

export const AttributeValueFilterEnum = Object.keys(
  attributeValueSortConfig,
) as [AttributeValueType, ...AttributeValueType[]];

export const filterAttributeValueSchema = filters(
  AttributeValueFilterEnum,
  "createdAt",
);

export type FilterAttributeValueSchema = z.infer<
  typeof filterAttributeValueSchema
>;
