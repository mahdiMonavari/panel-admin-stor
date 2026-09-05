import z from "zod";
import { attributeValueItemSchema } from "../../attributeValue/schema/create.schema";

export type createAttributeValueType = z.infer<typeof attributeValueItemSchema>;
