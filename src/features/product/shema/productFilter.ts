import z from "zod";
import { SORT_ORDERS } from "../../user/types/userFilter.type";

const sortFields = {
  totalStock: "تعداد موجودی",
  minPrice: "قیمت",
  createdAt: "تاریخ ایجاد",
} as const;
type SortFieldsType = keyof typeof sortFields;
const SORTFIELDS = Object.keys(sortFields) as [
  ...SortFieldsType[],
  SortFieldsType,
];

const baseProductFilterSchema = z.object({
  categories: z.string().optional(),
  search: z.string().optional(),
  order: z.enum(SORT_ORDERS).optional().default("desc"),
  sort: z.enum(SORTFIELDS).optional().default("createdAt"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// آیدی‌های اتریبیوت مستقیماً روی ریشه می‌شینن، پس فیلد جدای "attributes" حذف شد
// و catchall مقدار رشته‌ای (کاما جدا شده) می‌گیره
export const productFilterSchema = baseProductFilterSchema.catchall(
  z.string().optional(),
);

export type ProductFilterType = z.infer<typeof productFilterSchema>;
