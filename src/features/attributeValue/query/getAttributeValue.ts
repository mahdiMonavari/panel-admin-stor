import { prisma } from "@/src/lib/prisma";
import { filterAttributeValueSchema } from "../type/attributeValueFilters.type";
import { Prisma } from "@/generated/prisma/client";

export default async function getAttributeValues(queries: unknown) {
  const parsed = filterAttributeValueSchema.safeParse(queries);

  if (!parsed.success) {
    return {
      success: false,
      message: "پارامترهای جستجو نامعتبر است",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { limit, order, page, sort, search } = parsed.data;
  const skip = (page - 1) * limit;
  const where: Prisma.AttributeValueWhereInput = {
    ...(search && {
      OR: [
        { label: { contains: search, mode: "insensitive" } },
        { value: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  try {
    const [attributeValues, totalCount] = await prisma.$transaction([
      prisma.attributeValue.findMany({
        where,
        orderBy: {
          [sort]: order,
        },
        skip,
        take: limit,
      }),
      prisma.attributeValue.count({ where }),
    ]);

    return {
      success: true,
      attributeValues,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching attribute values:", error);
    return {
      success: false,
      message: "خطایی در دریافت اطلاعات رخ داد",
    };
  }
}
