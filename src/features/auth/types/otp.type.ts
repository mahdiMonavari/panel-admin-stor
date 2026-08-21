import z from "zod";
import { otpSchema } from "../schema/otp.schema";

export type otpType = z.infer<typeof otpSchema>