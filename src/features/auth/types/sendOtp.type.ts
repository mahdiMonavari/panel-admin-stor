import z from "zod";
import { otpSchema } from "../schema/sendOtp.schema";

export type otpType = z.infer<typeof otpSchema>