import z from "zod";

export const attributeValueItemSchema = z.object({
  label: z.string().min(1, "عنوان مقدار الزامی است"),
  value: z.string().min(1, "مقدار الزامی است"),
  code: z.string().optional(), // کد رنگ
});