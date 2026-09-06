import { prisma } from "@/src/lib/prisma";
import { categories } from "../components/CategoryLayout";

type getCategories =
  | {
      success: true;
      data: categories[];
    }
  | {
      success: false;
      message: string;
    };

export default async function getCategories(): Promise<getCategories> {
  const categories = await prisma.category.findMany();
  if (!categories) {
    return {
      success: false,
      message: "خطا در دریافت اطلاعات دوباره تلاش کنید",
    };
  }
  return {
    success: true,
    data: categories,
  };
}
