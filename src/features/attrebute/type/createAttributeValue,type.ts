import z from "zod";
import { attributeValueItemSchema } from "../schema/createAttrbuteValue.schema";

export type createAttributeValueType = z.infer <typeof attributeValueItemSchema>