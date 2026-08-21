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
    )
});