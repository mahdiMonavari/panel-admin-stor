import z from "zod";
import { SORT_ORDERS } from "../../user/types/userFilter.type";

const sortFields = {
  total: "تعداد موجودی",
  price: "قیمت",
  createdAt: "تاریخ ایجاد",
} as const;
type SortFieldsType = keyof typeof sortFields;
const SORTFIELDS = Object.keys(sortFields) as [
  ...SortFieldsType[],
  SortFieldsType,
];

const baseProductFilterSchema = z.object({
  categories: z.string().optional(),
  order: z.enum(SORT_ORDERS).optional().default("desc"),
  sort: z.enum(SORTFIELDS).optional().default("createdAt"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export const productFilterSchema = baseProductFilterSchema.extend({
  attributes: z.record(z.string(), z.array(z.string())).optional(),
});

export type ProductFilterType = z.infer<typeof productFilterSchema>;
