// src/schema/global.schema.ts
import { z } from "zod";
import { SORT_ORDERS } from "../features/user/types/userFilter.type";

type EnumValues = [string, ...string[]];

export const filters = <
  TValues extends EnumValues,
  TDefault extends TValues[number] = TValues[number],
>(
  sortFields: TValues,
  defaultSort?: TDefault,
) => {
  const fallbackSort = defaultSort ?? (sortFields[0] as TDefault);

  return z.object({
    search: z.string().optional(),
    sort: z.enum(sortFields).optional().default(fallbackSort),
    order: z.enum(SORT_ORDERS).optional().default("desc"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  });
};
