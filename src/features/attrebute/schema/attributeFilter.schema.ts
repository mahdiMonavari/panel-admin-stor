import z from "zod";
import { AttributeSortFields } from "../type/attributeFilter.type";
import { SORT_ORDERS } from "../../user/types/userFilter.type";

export const attributeFilterSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(AttributeSortFields).optional().default("createdAt"),
  order: z.enum(SORT_ORDERS).optional().default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
