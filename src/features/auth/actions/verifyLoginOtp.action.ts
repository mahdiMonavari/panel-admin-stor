"use server";

import { setCookies, updateRefreshToken } from "@/src/lib/utiles/utiles";
import { otpVerifySchema } from "../schema/verifyotp.schema";
import { verifyOtp } from "./verifyOtp.ation";
import { prisma } from "@/src/lib/prisma";

type LoginOtpResoltType = {
  success: boolean;
  errorMessage?: string;
  counter?: number;
};

export async function LoginOtpHandler(
  rowData: unknown,
): Promise<LoginOtpResoltType> {
  const parsed = otpVerifySchema.safeParse(rowData);
  try {
    if (!parsed.success) {
      return {
        success: false,
        errorMessage: parsed.error.issues[0].message,
      };
    }
    const { code, phone } = parsed.data;
    const res = await verifyOtp({ code, phone });

    if (!res.success) {
      return {
        success: false,
        errorMessage: res.errorMessage,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user) {
      return {
        success: false,
        errorMessage: "کاربری با این شماره یافت نشد",
      };
    }
    const refreshToken = await setCookies({ userId: user.id, role: user.role });

    await updateRefreshToken({ refreshToken, userId: user.id });
    return {
      ...res,
    };
  } catch (err: unknown) {
    return {
      success: false,
      errorMessage: err instanceof Error ? err.message : "",
    };
  }
}
