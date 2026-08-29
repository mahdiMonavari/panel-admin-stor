import { prisma } from "@/src/lib/prisma";
import { userFiltersSchema } from "../shemas/userFilter.shema";
import { UserType } from "../types/user.type";
import { getErrorMessage } from "@/src/lib/utiles/utiles";
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
    try{
    const where = {
        ...(search && {
            fullName: { contains: search, mode: "insensitive" as const }
        }),
        ...(role !== "all" && { role })
    };
    const [data, totalCount] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { [sort]: order },
            skip: (page - 1) * limit,
            take: limit,
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

    return { 
        success: true, 
        data,
        meta: {
            total: totalCount,
            page,
            limit
        }
    };
    }catch(error){
        return{
            success:false,
            errorMessage:getErrorMessage(error)
        }
    }
}
