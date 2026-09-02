import z from "zod";
import CreateCategorySchema from "../schema/create.shema";

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>