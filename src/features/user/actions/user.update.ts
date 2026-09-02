"use server"
import { getErrorMessage } from "@/src/lib/utiles/utiles"
import { UserSchema } from "../types/user.type"
import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"

type UpdateUserResult = {
    success : true
} | {
    success : false,
    errorMessage : string
}
const PartialUserSchema = UserSchema.partial();

export async function updateUser(
  rowData: unknown
): Promise<UpdateUserResult> {
  const parsed = PartialUserSchema.safeParse(rowData);

  if (!parsed.success) {
    return {
      success: false,
      errorMessage: parsed.error.issues[0].message,
    };
  }

  const { id, ...data } = parsed.data;

  if (!id) {
    return {
      success: false,
      errorMessage: "شناسه کاربر الزامی است",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data,
    });
revalidatePath(`/panel-admin/users`)
    return {
        
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: getErrorMessage(error),
    };
  }
}
