"use server";

import { prisma } from "@/src/lib/prisma";
import { userSchema } from "../schema/register.schema";
import {
  PasswordService,
  setCookies,
  updateRefreshToken,
} from "@/src/lib/utiles/utiles";
import { Prisma } from "@/generated/prisma/client";

type CreateNewUserResult =
  | {
      success: true;
    }
  | {
      success: false;
      errorMessage?: string;
    };

export async function createNewUser(
  rawData: unknown,
): Promise<CreateNewUserResult> {
  const parsed = userSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errorMessage: parsed.error.issues[0]?.message,
    };
  }

  try {
    const { firstname, lastname, password, phone } = parsed.data;
    const userCounts = await prisma.user.count();
    const role = userCounts === 0 ? "ADMIN" : "USER";
    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
      select: {
        id: true,
      },
    });
    if (existingUser) {
      return {
        success: false,
        errorMessage: "این شماره از قبل در سایت وجود دارد",
      };
    }

    const hashedPassword = await PasswordService.hash(password);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        password: hashedPassword,
        phone,
        role,
        fullname: `${firstname} ${lastname}`,
        refreshToken: "",
      },
      select: {
        id: true,
        role: true,
        phone: true,
      },
    });

    const refreshToken = await setCookies({
      userId: user.id,
      role: user.role,
    });
    updateRefreshToken({ refreshToken, userId: user.id });
    return {
      success: true,
    };
  } catch (error) {
    console.error("createNewUser error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        errorMessage: "این شماره از قبل در سایت وجود دارد",
      };
    }

    return {
      success: false,
      errorMessage: "خطایی از سمت سرور رخ داد، دوباره تلاش کنید",
    };
  }
}
