"use server";
import { Prisma } from "@/generated/prisma/client";
import { productFilterSchema } from "../shema/productFilter";
import { prisma } from "@/src/lib/prisma";

type getProductsResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      data: Prisma.ProductGetPayload<{
        include: { category: true; variants: true };
      }>[];
    };
export default async function getProducts(
  rowData: unknown,
): Promise<getProductsResult> {
  console.log(rowData);

  const parsed = productFilterSchema.safeParse(rowData);
  if (!parsed.success) {
    {
      return {
        success: false,
        message: parsed.error.issues[0].message,
      };
    }
  }
  const { categories, limit, order, page, sort, search, ...attributes } =
    parsed.data;
  const attributesFilter = Object.entries(attributes).map(
    ([attributeId, ids]) => ({
      variants: {
        some: {
          values: {
            some: {
              attributeValueId: { in: ids },
            },
          },
        },
      },
    }),
  );

  const where = {
    ...(search && { name: { startsWith: search } }),
    AND: attributesFilter,
    ...(categories && { categoryId: { in: categories.split(",") } }),
    ...(sort === "minPrice" && {
      minPrice: {
        not: null,
      },
    }),
  };
  const orderBy = {
    [sort]: order,
  };
  console.log(order);

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      variants: true,
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });
  return {
    success: true,
    data: products,
  };
}
