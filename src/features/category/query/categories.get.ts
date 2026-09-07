import { prisma } from "@/src/lib/prisma";
import { categories } from "../components/CategoryLayout";

type GetCategoriesResult =
  | {
      success: true;
      data: categories[];
    }
  | {
      success: false;
      message: string;
    };

export default async function getCategories(
  id?: string,
): Promise<GetCategoriesResult> {
  const categories = await prisma.category.findMany({
    where: {
      ...(id && {
        attributes: {
          some: {
            attributeId: id,
          },
        },
      }),
    },
    include: {
      attributes: true,
      children: true,
    },
  });

  return {
    success: true,
    data: categories,
  };
}
