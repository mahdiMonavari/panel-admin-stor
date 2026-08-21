import { z } from "zod";
import { toEnglishDigits } from "@/src/lib/utiles/normalNumber";

export const userSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),

  lastname: z
    .string()
    .trim()
    .min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام خانوادگی نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),

  phone: z
    .string()
    .transform(toEnglishDigits)
    .pipe(
      z
        .string()
        .regex(/^09\d{9}$/, "شماره تلفن باید یک شماره موبایل معتبر باشد")
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
});
