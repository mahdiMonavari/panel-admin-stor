import z from "zod";
import { loginPasswordSchema } from "../schema/login.password.schema";

export type LoginPassType = z.infer<typeof loginPasswordSchema>