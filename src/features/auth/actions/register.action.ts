"use server";


import { prisma } from "@/src/lib/prisma";
import { userSchema } from "../schema/register.schema";
import { PasswordService, TokenService } from "@/src/lib/utiles/utiles";
import { cookies } from "next/headers";

type createNewUserResolvType = {
    success:true
} | {
    success:false;
    errorMessage ?: string
}

export async function createNewUser(rowDate:unknown):Promise<createNewUserResolvType>{
    const parsed = userSchema.safeParse(rowDate)
    if(!parsed.success){
        const errorMessage = parsed.error.issues[0].message
        return { 
            success:false,
            errorMessage
        }
    }
    try{
        const {firstname,lastname,password,phone} = parsed.data
        const usersCount = await prisma.user.count();
        const role = usersCount === 0 ? "ADMIN" : "USER";
        const alreadyExist = await prisma.user.findFirst({
            where:{
                phone
            }
        })
        if(alreadyExist){
            return{
                success : false,
                errorMessage:"این شماره از قبل در سایت وجود دارد"
            }
        }
        const hashPassword = await PasswordService.hash(password)
        const accessToken = TokenService.generateAccessToken({phone , role})
        const refreshToken = TokenService.generateRefreshToken({phone})
        const newUser = await prisma.user.create({
            data:{
                firstname,
                lastname,
                password:hashPassword,
                phone,
                role,
                refreshToken,
                fullname :`${firstname} ${lastname}`             
            }
        })
        const cookiesStore = await cookies()
        cookiesStore.set("accessToken" ,accessToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15
        })
        cookiesStore.set("refreshToken" , refreshToken , {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 15
        })
        return {
            success:true
        }
    }catch(error){ 
        console.log(error);               
        return{
            success:false,
            errorMessage : "خطا سمت سرور دوباره تلاش کنید"
        }
    }
}