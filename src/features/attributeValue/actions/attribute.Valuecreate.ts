"use server";
import { prisma } from "@/src/lib/prisma";
import { attributeValueItemSchema } from "../schema/create.schema";
import z from "zod";
import { getErrorMessage } from "@/src/lib/utiles/utiles";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";

const attributeValueSchema = attributeValueItemSchema.extend({
  attributeId: z.string(),
});

type generateAttributeValueResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
    };

export default async function generateAttributeValue(
  rowData: unknown,
): Promise<generateAttributeValueResult> {
  const parsed = attributeValueSchema.safeParse(rowData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }
  const { label, value, code, attributeId } = parsed.data;
  try {
    const attributeValue = await prisma.attributeValue.create({
      data: {
        label,
        value,
        ...(code && { code }),
        attributeId,
      },
    });
    revalidatePath(`/panel-admin/categories/attrebute/${attributeId}`);
    return {
      success: true,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "این مقدار برای این ویژگی از قبل تعریف شده",
      };
    }
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
