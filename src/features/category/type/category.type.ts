import { Prisma } from "@/generated/prisma/client";

export type categories = Prisma.CategoryGetPayload<{
  include: {
    children?: true;
    attributes?: true;
  };
}>;
