import { toEnglishDigits } from "@/src/lib/utiles/normalNumber";
import z from "zod";

export const loginPasswordSchema = z.object({
    phone : z
        .string()
        .transform(toEnglishDigits) 
        .pipe(
        z.string().regex(
            /^(?:\+98|0098|0)?9\d{9}$/,
            "شماره موبایل معتبر نیست"
        )
    ),
      password: z
        .string()
        .transform(toEnglishDigits)
        .pipe(
          z
            .string()
            .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
            .max(100, "رمز عبور نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
    ),
})