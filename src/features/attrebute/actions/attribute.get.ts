import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";
type GetAttributeResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      attribute: Prisma.AttributeGetPayload<{}>;
    };

export async function getAttribute(id: string): Promise<GetAttributeResult> {
  if (typeof id !== "string") {
    return {
      success: false,
      message: "آدرس نامعتبر است",
    };
  }
  const attribute = await prisma.attribute.findFirst({
    where: { id },
    include: {
      categories: true,
      values: true,
    },
  });
  if (!attribute) {
    return {
      success: false,
      message: "ویژگی یافت نشد",
    };
  }
  return {
    success: true,
    attribute,
  };
}
