import z from "zod";
import categorySchema from "../schema/category.shema";

export type CategoryType = z.infer<typeof categorySchema>