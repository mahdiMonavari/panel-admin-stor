"use server";
import { prisma } from "@/src/lib/prisma";
import { attributeFilterSchema } from "../schema/attributeFilter.schema";
import { Prisma } from "@/generated/prisma/client";
import { getErrorMessage } from "@/src/lib/utiles/utiles";

// ✅ ۱. استخراج دقیق تایپ خروجی کوئری پریزما
export type AttributeItemWithRelations = Prisma.AttributeGetPayload<{
  include: {
    categories: true;
    values: true;
  };
}>;

// ✅ ۲. استفاده از تایپ واقعی در خروجی
type GetAttributeResult =
  | {
      success: true;
      data: AttributeItemWithRelations[];
      meta: {
        totla: number;
        page: number;
        limit: number;
      };
    }
  | {
      success: false;
      errorMessage?: string;
    };

export async function getAttributes(
  rowData: unknown,
): Promise<GetAttributeResult> {
  const parsed = attributeFilterSchema.safeParse(rowData);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0].message;
    return {
      success: false,
      errorMessage,
    };
  }
  const { limit, order, page, sort, search } = parsed.data;
  console.log(order, sort);

  const where: Prisma.AttributeWhereInput = {
    ...(search && {
      OR: [
        { name: { startsWith: search, mode: "insensitive" } },
        { label: { startsWith: search, mode: "insensitive" } },
      ],
    }),
  };
  let orderBy: Prisma.AttributeOrderByWithRelationInput;

  if (sort === "categories" || sort === "values") {
    orderBy = {
      [sort]: {
        _count: order,
      },
    };
  } else {
    orderBy = {
      [sort]: order,
    };
  }
  try {
    const [data, countData] = await Promise.all([
      prisma.attribute.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          categories: true,
          values: true,
        },
      }),
      prisma.attribute.count({ where }),
    ]);

    return {
      success: true,
      data,
      meta: {
        limit,
        page,
        totla: countData,
      },
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: getErrorMessage(error),
    };
  }
}
