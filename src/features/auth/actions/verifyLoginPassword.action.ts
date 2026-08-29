"use server"
import { prisma } from "@/src/lib/prisma"
import { loginPasswordSchema } from "../schema/login.password.schema"
import { PasswordService, updateRefreshToken } from "@/src/lib/utiles/utiles"
import { setCookies } from "@/src/lib/utiles/utiles"

type verifyUserLoginResultType = {
    success : true
} | {
    success:false , 
    errorMessage ?: string
}

export default async function verifyUserLogin(data:unknown) : Promise<verifyUserLoginResultType>{
    const parsed = loginPasswordSchema.safeParse(data)
    if(!parsed.success){
        return{
            success:false,
            errorMessage : parsed.error.issues[0].message
        }
    }
    try{
    const {password,phone} = parsed.data
    const user = await prisma.user.findUnique({
    where: { phone },
    select: {
        id: true,
        phone: true,
        password: true,
        role: true,
    },
    })

    if(!user){
        return{
            success:false,
            errorMessage:"کاربری با این اطلاعات یافت نشد"
        }
    }
    const userHashedPassword = user.password
    const isParePassword =  await PasswordService.compare(password , userHashedPassword)
    if(!isParePassword){
        return{
            success:false,
            errorMessage:"کاربری با این اطلاعات یافت نشد"
        }
    }    
    const refreshToken = await setCookies({userId : user.id , role : user.role})
    await updateRefreshToken({refreshToken , userId : user.id})    
    return{
        success : true
    }
    }catch(error){
        console.log(error);
        return{
             success : false,
             errorMessage : "خطا از سمت سرور دوباره تلاش کنید"
        }
    }
}