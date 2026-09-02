import { z } from "zod";

export const categorySchema = z.object({  
  id: z.string().uuid({ message: "شناسه نامعتبر است" }),
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

export default categorySchema ;
