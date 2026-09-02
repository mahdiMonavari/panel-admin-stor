import { z } from "zod";

// تعریف اسکیمای اعتبارسنجی Zod
export const UserSchema = z.object({
  id: z.string(),
  fullname: z.string(),
  phone: z.string(),
  role: z.string(),
  isBan: z.boolean(),
  createdAt: z.date(),
});

// استخراج تایپ TypeScript به‌صورت خودکار از اسکیما
export type UserType = z.infer<typeof UserSchema>;
