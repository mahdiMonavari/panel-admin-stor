import { prisma } from "@/src/lib/prisma";
import { userFiltersSchema } from "../shemas/userFilter.shema";
import { UserType } from "../types/user.type";
type getUsersResultType = {
    data: UserType[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
    success: true;
} | {
    success: false;
    errorMessage: string;
};


export async function getUsers(rowParams: unknown): Promise<getUsersResultType> {
    const parsed = userFiltersSchema.safeParse(rowParams);
    if (!parsed.success) {
        return { errorMessage: parsed.error.issues[0].message, success: false };
    }

    const { limit, order, page, role, sort, search } = parsed.data;

    const where = {
        ...(search && {
            fullName: { contains: search, mode: "insensitive" as const }
        }),
        ...(role !== "all" && { role })
    };

    // ۱. اجرای موازی کوئری برای سرعت بیشتر (هم دیتا، هم تعداد کل)
    const [data, totalCount] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { [sort]: order }, // نکته: اینجا دقت کن sort حتما باید با فیلد دیتابیس یکی باشد
            skip: (page - 1) * limit,
            take: limit,
            // ۲. انتخاب فیلدهای امن
            select: {
                id: true,
                fullname: true,
                phone: true,
                role: true,
                isBan: true,
                createdAt: true,
            }
        }),
        prisma.user.count({ where })
    ]);

    // ۳. تغییر ساختار بازگشتی برای شامل شدن متا‌دیتا
    return { 
        success: true, 
        data,
        meta: {
            total: totalCount,
            page,
            limit
        }
    };
}
