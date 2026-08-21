import z from "zod";
import { userSchema } from "../schema/register.schema";

export type UserType = z.infer<typeof userSchema>;
