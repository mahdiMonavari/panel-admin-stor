"use server";
import { getErrorMessage } from "@/src/lib/utiles/utiles";
import { createAttributeSchema } from "../schema/createAttribute.schema";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";

type CreateAttributeResult =
  | {
      success: true;
    }
  | {
      success: false;
      errorMessage?: string;
    };
export async function createAttribute(
  rowData: unknown,
): Promise<CreateAttributeResult> {
  const parsed = createAttributeSchema.safeParse(rowData);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0].message;
    return {
      success: false,
      errorMessage,
    };
  }
  const { label, name, type } = parsed.data;
  try {
    const attribute = await prisma.attribute.create({
      data: { label, name, type },
    });
    if (attribute) {
      revalidatePath("/panel-admin/categories/attrebute");
      return {
        success: true,
      };
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        errorMessage: "ویژگی‌ای با این نام و نوع قبلاً ثبت شده است.",
      };
    }
    return {
      success: false,
      errorMessage: getErrorMessage(error),
    };
  }
  return { success: true };
}
