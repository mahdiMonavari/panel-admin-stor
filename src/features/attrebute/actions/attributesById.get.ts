"use server";
import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/src/lib/prisma";

type GetAttributesByCategoryIdResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      attributes: Prisma.AttributeGetPayload<{ include: { values: true } }>[];
    };

export async function GetAttributesByCategoryId(
  id: string,
): Promise<GetAttributesByCategoryIdResult> {
  if (typeof id !== "string") {
    return {
      success: false,
      message: "دیتا وارد شده صحیح نمیباشد",
    };
  }
  const rawData = await prisma.categoryAttribute.findMany({
    where: {
      categoryId: id,
    },
    select: {
      attribute: {
        include: {
          values: true,
        },
      },
    },
  });
  const attributes = rawData.map((item) => item.attribute);
  return {
    success: true,
    attributes,
  };
}
