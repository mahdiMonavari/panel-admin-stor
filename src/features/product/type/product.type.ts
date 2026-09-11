import { Prisma } from "@/generated/prisma/client";
import z from "zod";
import { createProductSchema } from "../shema/create.product";

export type prodcut = Prisma.ProductGetPayload<{}>;

export type createProductType = z.infer<typeof createProductSchema>;
