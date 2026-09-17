"use server";

import { prisma } from "@/src/lib/prisma";
import type { AttributeItem } from "../components/FillAttributeValue";
import {
  createAttributesSchema,
  productBaseSchema,
} from "../shema/create.product";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

type StaticAttr = { attributeId: string; value: string };

type ActionResult =
  | { success: true; data: { productId: string; variantsCount: number } }
  | { success: false; message: string };

function getCartesianProduct(arrays: string[][]): string[][] {
  if (arrays.length === 0) return [];
  return arrays.reduce<string[][]>(
    (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
    [[]],
  );
}

function makeSignature(valueIds: string[]) {
  // ترتیب نباید مهم باشد
  return [...valueIds].sort().join(".");
}

function getErrorMessage(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint failed
    if (e.code === "P2002") {
      // اگر خواستی می‌تونی e.meta?.target رو هم نمایش بدی
      return "این وریانت/ترکیب ویژگی‌ها قبلاً برای این محصول ثبت شده است.";
    }
    return `خطای دیتابیس: ${e.code}`;
  }

  if (e instanceof Error) return e.message;
  return "خطایی هنگام ایجاد محصول رخ داد.";
}

export async function createProduct(
  rowData: unknown,
  attributesForSchema: AttributeItem[],
): Promise<ActionResult> {
  const schema = productBaseSchema.extend({
    attributes: createAttributesSchema(attributesForSchema),
  });

  const parsed = schema.safeParse(rowData);
  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues?.[0]?.message ?? "داده‌های ورودی نامعتبر است.",
    };
  }

  const { attributes, categoryId, description, name } = parsed.data;

  const statics: StaticAttr[] = [];
  const dynamics: string[][] = [];

  // attributes: { [attributeId]: string | string[] | Record<string, string> | ... }
  for (const attributeId in attributes) {
    const v: unknown = (attributes as any)[attributeId];

    // متغیرها باید لیست id های AttributeValue باشند: string[]
    if (Array.isArray(v)) {
      const ids = v.map(String).filter(Boolean);
      if (ids.length > 0) dynamics.push(ids);
      continue;
    }

    // اگر ساختار آبجکت می‌فرستید (مثلا از RHF)، به آرایه تبدیلش می‌کنیم
    if (typeof v === "object" && v !== null) {
      const ids = Object.values(v as Record<string, unknown>)
        .map(String)
        .filter(Boolean);
      if (ids.length > 0) dynamics.push(ids);
      continue;
    }

    // بقیه موارد می‌شوند استاتیک
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      statics.push({ attributeId, value: String(v) });
    }
  }

  const combinations = getCartesianProduct(dynamics);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1) Product
      const product = await tx.product.create({
        data: { name, description, categoryId },
        select: { id: true },
      });

      // 2) Static attributes
      if (statics.length > 0) {
        await tx.productStaticAttribute.createMany({
          data: statics.map((s) => ({
            productId: product.id,
            attributeId: s.attributeId,
            value: s.value,
          })),
          skipDuplicates: true,
        });
      }

      // 3) Variants
      let variantsCount = 0;

      if (combinations.length > 0) {
        // ایجاد وریانت‌ها (با signature) — داخل تراکنش و با tx
        await Promise.all(
          combinations.map((variantValueIds) => {
            const signature = makeSignature(variantValueIds);

            return tx.productVariant.create({
              data: {
                productId: product.id,
                signature,
                price: 0,
                stock: 0,
                values: {
                  create: variantValueIds.map((valId) => ({
                    attributeValue: { connect: { id: valId } },
                  })),
                },
              },
              select: { id: true },
            });
          }),
        );

        variantsCount = combinations.length;
      } else {
        // وریانت پیش‌فرض برای محصول بدون ویژگی متغیر
        await tx.productVariant.create({
          data: {
            productId: product.id,
            signature: "default",
            price: 0,
            stock: 0,
          },
          select: { id: true },
        });

        variantsCount = 1;
      }

      return { productId: product.id, variantsCount };
    });
    revalidatePath("/panel-admin/products");
    return { success: true, data: result };
  } catch (e) {
    return { success: false, message: getErrorMessage(e) };
  }
}
