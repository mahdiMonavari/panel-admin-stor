import { z } from "zod";
import { SORT_FIELDS, SORT_ORDERS } from "../types/userFilter.type";

export const userFiltersSchema = z.object({
  search: z.string().optional(),

  role: z.enum(["user", "admin", "all"])
    .optional()
    .default("all"),
  sort: z.enum(SORT_FIELDS)
    .optional()
    .default("createdAt"),
  order: z.enum(SORT_ORDERS)
    .optional()
    .default("desc"),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),
});
