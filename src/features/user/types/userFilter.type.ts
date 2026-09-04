import z from "zod";
import { userFiltersSchema } from "../shemas/userFilter.shema";

export const SORT_CONFIG = {
  createdAt: "تاریخ ثبت نام",
  lastname: "حروف الفبا",
} as const;
export type SortField = keyof typeof SORT_CONFIG;
export const SORT_FIELDS = Object.keys(SORT_CONFIG) as [
  SortField,
  ...SortField[],
];

export const ORDER_CONFIG = {
  desc: "نزولی",
  asc: "سعودی",
} as const;
export type SortOrders = keyof typeof ORDER_CONFIG;
export const SORT_ORDERS = Object.keys(ORDER_CONFIG) as [
  SortOrders,
  ...SortOrders[],
];

export type UserFilterType = z.infer<typeof userFiltersSchema>;
