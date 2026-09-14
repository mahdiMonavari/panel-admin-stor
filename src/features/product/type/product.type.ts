import { Prisma } from "@/generated/prisma/client";

export type prodcut = Prisma.ProductGetPayload<{}>;

type ProductAttributes = Record<string, string | string[] | number>;

export type createProductType = {
  name: string;
  description: string;
  categoryId: string;
  attributes: ProductAttributes;
};
