import { toEnglishDigits } from "@/src/lib/utiles/normalNumber"
import {z} from "zod"

export const otpSchema = z.object({
    phone : z
        .string()
        .transform(toEnglishDigits) 
        .pipe(
        z.string().regex(
            /^(?:\+98|0098|0)?9\d{9}$/,
            "شماره موبایل معتبر نیست"
        )
        ),
})
