"use server";
import { prisma } from "@/src/lib/prisma";
import { otpVerifySchema } from "../schema/verifyotp.schema";

type VerfiyOtpResoltType = {
  success: boolean;
  errorMessage?: string;
  counter?: number;
};
const MAX_ATTEMPT = 3;

export async function verifyOtp(
  rowData: unknown,
): Promise<VerfiyOtpResoltType> {
  const parsed = otpVerifySchema.safeParse(rowData);
  if (!parsed.success) {
    return {
      success: false,
      errorMessage: parsed.error.issues[0].message,
    };
  }
  try {
    const { phone, code } = parsed.data;
    const otpTarget = await prisma.otp.findFirst({
      where: {
        phone,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!otpTarget) {
      return {
        success: false,
        errorMessage: "کدی برای این شماره تلفن یافت نشد",
      };
    }
    if (otpTarget.attempts >= MAX_ATTEMPT) {
      return {
        success: false,
        errorMessage: "به سقف تلاش برای تایید این کد رسیدید",
      };
    }
    const isValidCode = otpTarget.code === code;
    if (!isValidCode) {
      await prisma.otp.update({
        where: {
          id: otpTarget.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });
      let errorMessage = "";
      if (MAX_ATTEMPT > otpTarget.attempts + 1) {
        errorMessage = `کد معتبر نمیباشد ${MAX_ATTEMPT - (otpTarget.attempts + 1)} تلاش دیگر باقی مانده `;
        return {
          success: false,
          errorMessage,
        };
      } else {
        await prisma.otp.delete({
          where: {
            id: otpTarget.id,
          },
        });
        errorMessage = "کد غیر فعال شد درخاست ارسال مجدد کد بدهید";
        return {
          success: false,
          errorMessage,
          counter: 0,
        };
      }
    }
    await prisma.otp.delete({
      where: {
        id: otpTarget.id,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errorMessage: "خطا از سمت سرور دوباره تلاش کنید",
    };
  }
}
