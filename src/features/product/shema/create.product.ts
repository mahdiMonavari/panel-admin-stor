import z from "zod";

export const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "نام محصول باید حداقل ۳ کاراکتر باشد" })
    .max(40, "نام محصول باید حداکثر 40 کاراکتر باشد"),
  description: z
    .string()
    .trim()
    .min(3, { message: "توضیحات کوتاه محصول باید حداقل ۳ کاراکتر باشد" })
    .max(40, "توضیحات کوتاه محصول باید حداکثر 40 کاراکتر باشد"),
  categoryId: z.string().uuid(),
});
