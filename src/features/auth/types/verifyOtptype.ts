import z from "zod";
import { otpVerifySchema } from "../schema/verifyotp.schema";

export type otpVerifyType = z.infer<typeof otpVerifySchema>