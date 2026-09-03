import z from "zod";
import { createAttributeSchema } from "../schema/createAttribute.schema";

export type createAttributeType = z.infer<typeof createAttributeSchema>