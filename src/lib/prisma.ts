import { PrismaPg } from "@prisma/adapter-pg";
// اصلاح اینجا:
import { PrismaClient } from "@/generated/prisma/client"; 
import { Pool } from "pg"; // معمولاً بهتر است از یک Pool استفاده کنی

// ایجاد Pool برای دیتابیس (توصیه شده برای کارایی بهتر)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
