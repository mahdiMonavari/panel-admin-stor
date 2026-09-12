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
  const attributes = await prisma.attribute.findMany({
    include: {
      values: true,
      categories: {
        where: {
          categoryId: id,
        },
      },
    },
  });
  return {
    success: true,
    attributes,
  };
}
