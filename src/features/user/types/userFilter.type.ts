import z from "zod";
import { userFiltersSchema } from "../shemas/userFilter.shema";
import { SortOrder } from "@/generated/prisma/internal/prismaNamespace";

export const SORT_CONFIG ={
    createdAt: "تاریخ ثبت نام",
    lastname: "حروف الفبا",
} as const
export type SortField = keyof typeof SORT_CONFIG;
export const SORT_FIELDS = Object.keys(SORT_CONFIG) as [SortField, ...SortField[]];


export const ORDER_CONFIG = {
    asc : "سعودی",
    desc : "نزولی"
} as const;
export type SortOrders = keyof typeof ORDER_CONFIG
export const SORT_ORDERS = Object.keys(ORDER_CONFIG) as [SortOrders , ...SortOrder[]]

export type UserFilterType = z.infer<typeof userFiltersSchema>