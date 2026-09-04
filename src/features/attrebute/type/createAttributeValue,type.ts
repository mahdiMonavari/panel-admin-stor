import z from "zod";
import { attributeValueItemSchema } from "../../attributeValue/schema/createAttrbuteValue.schema";

export type createAttributeValueType = z.infer<typeof attributeValueItemSchema>;
