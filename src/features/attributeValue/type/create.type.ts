import z from "zod";
import { attributeValueItemSchema } from "../schema/create.schema";

export type CreateAttributeValue = z.infer<typeof attributeValueItemSchema>;
