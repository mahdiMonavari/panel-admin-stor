import { Prisma } from "@/generated/prisma/client";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    children: true;
    attributes: true;
  };
}>;

// ۱. تایپ مشخصه‌ها
type AttributeRelation = Prisma.CategoryGetPayload<{
  include: { attributes: true };
}>["attributes"][number];

export type CategoryTreeNodeType = {
  id: string;
  name: string;
  parentId: string | null;
  attributes: AttributeRelation[];
  children: CategoryTreeNodeType[];
};
