import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().trim().min(3, { message: "نام باید حداقل ۳ کاراکتر باشد" }),
  parentId: z.string().optional().or(z.literal("")),
});

export default CreateCategorySchema;
