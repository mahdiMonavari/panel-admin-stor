import { toEnglishDigits } from "@/src/lib/utiles/normalNumber";
import z from "zod";

export const otpVerifySchema = z.object({
  code: z
    .string()
    .transform(toEnglishDigits) 
    .pipe(
    z.string().regex(
        /^\d{5}$/, "کد تأیید باید دقیقاً ۵ رقم باشد"
        )
    ),
    phone : z
            .string()
            .transform(toEnglishDigits) 
            .pipe(
            z.string().regex(
                /^(?:\+98|0098|0)?9\d{9}$/,
                "شماره موبایل معتبر نیست"
            )
            ),
});