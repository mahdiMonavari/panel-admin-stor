import { toEnglishDigits } from "@/src/lib/utiles/normalNumber";
import z from "zod";

export const attributeValueItemSchema = z.object({
  label: z.string().min(1, "عنوان مقدار الزامی است"),
  value: z
    .string({ message: "مقدار الزامی است" })
    .transform((value) => toEnglishDigits(value.trim()))
    .pipe(
      z
        .string()
        .min(1, "مقدار الزامی است")
        .regex(
          /^[A-Za-z0-9_-]+$/,
          "مقدار فقط باید شامل حروف، اعداد انگلیسی، خط تیره یا زیرخط باشد",
        ),
    ),
  code: z.string().optional(), // کد رنگ
});
