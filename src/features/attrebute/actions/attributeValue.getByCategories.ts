"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";
import getRoot from "../../category/actions/getTree.action";

export type AttributeValueFilterProdicts = Prisma.AttributeGetPayload<{}>[];

type GetAttributeValueWithCategoryIdsResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      data: AttributeValueFilterProdicts;
    };

export default async function getAttributeValueWithCategoryIds(
  ids: string | null,
): Promise<GetAttributeValueWithCategoryIdsResult> {
  if (!ids) {
    return {
      success: false,
      message: "مقادیر وارد شده در url معتبر نمیباشد",
    };
  }
  const arrayId = ids.split(",");
  const promises = arrayId.map((id) => getRoot(id));

  const roots = (await Promise.all(promises)).flat();
  const rootIds = new Set<string>();
  roots.forEach((root) => {
    if (!root.success) {
      throw new Error(root.message);
    }
    root.data.forEach((category) => rootIds.add(category.id));
  });

  try {
    const attributeValues = await prisma.category.findMany({
      where: {
        id: {
          in: [...rootIds],
        },
      },
      include: {
        attributes: {
          include: {
            attribute: {
              include: { values: true },
            },
          },
        },
      },
    });
    if (attributeValues.length) {
      const attributes = new Map<
        string,
        Prisma.AttributeGetPayload<{ include: { values: true } }>
      >();
      attributeValues.forEach((item) =>
        item.attributes.forEach((x) => {
          if (x.attribute.type === "SELECT") {
            attributes.set(x.attribute.id, x.attribute);
          }
        }),
      );

      return {
        success: true,
        data: [...attributes.values()],
      };
    } else {
      return {
        success: false,
        message: "داده ای یافت نشد برای این دسته بندیها",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "خطا از سمت سرور دوباره تلاش کنید",
    };
  }
}
