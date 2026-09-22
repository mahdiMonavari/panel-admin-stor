"use server";
import { Prisma } from "@/generated/prisma/client";
import { productFilterSchema } from "../shema/productFilter";
import { prisma } from "@/src/lib/prisma";
import getChildrenCategories from "../../category/actions/getChildren.action";

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
  const parsed = productFilterSchema.safeParse(rowData);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  const {
    categories,
    limit,
    order,
    startPrice,
    endPrice,
    page,
    sort,
    search,
    ...attributes
  } = parsed.data;
  let allChildrenCategories: undefined | string[] = undefined;
  if (categories) {
    const res = await getChildrenCategories(categories);
    if (!res.success) {
      return {
        success: false,
        message: res.message,
      };
    }
    allChildrenCategories = res.data;
  }

  const attributesFilter: Prisma.ProductWhereInput[] = Object.entries(
    attributes,
  )
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([, ids]) => ({
      variants: {
        some: {
          values: {
            some: {
              attributeValueId: { in: ids.split(",") },
            },
          },
        },
      },
    }));

  const where: Prisma.ProductWhereInput = {
    ...(search && { name: { startsWith: search } }),
    ...(attributesFilter.length > 0 && { AND: attributesFilter }),
    ...(allChildrenCategories && { categoryId: { in: allChildrenCategories } }),
    ...(sort === "minPrice" && {
      minPrice: {
        not: null,
      },
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    [sort]: order,
  };

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      variants: { include: { values: { include: { attributeValue: true } } } },
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
