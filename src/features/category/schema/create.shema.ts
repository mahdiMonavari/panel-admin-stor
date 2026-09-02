import { z } from "zod";

export const CreateCategorySchema = z.object({  
  name: z
    .string()
    .trim()
    .min(3, { message: "نام باید حداقل ۳ کاراکتر باشد" }),  
  parentName: z
    .string()
    .trim()
    .min(3, { message: "نام والد باید حداقل ۳ کاراکتر باشد" })
    .optional()    
    .or(z.literal("")), 
});

export default CreateCategorySchema ;
