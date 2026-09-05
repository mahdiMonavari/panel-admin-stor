import z from "zod";
import { attributeFilterSchema } from "../schema/attributeFilter.schema";

export const AttributeSortConfig = {
  createdAt: "تاریخ ایجاد",
  values: "تعداد مقادیر",
  categories: "تعداد دسته بندیهای استفاده",
  name: "بر اثاث حروف الفبا",
} as const;
export type AttributeSortType = keyof typeof AttributeSortConfig;
export const AttributeSortFields = Object.keys(AttributeSortConfig) as [
  AttributeSortType,
  ...AttributeSortType[],
];
export type AttributeFilter = z.infer<typeof attributeFilterSchema>;
