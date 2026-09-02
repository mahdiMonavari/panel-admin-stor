"use server"
import { prisma } from "@/src/lib/prisma"
import { getErrorMessage } from "@/src/lib/utiles/utiles"
import { revalidatePath } from "next/cache"

type deleteUserType = {
    success : true
} | {
    success : false,
    errorMesage : string
}

export async function deleteUser (userId : string) : Promise<deleteUserType>{
    if(typeof userId === "string"){
        try{
            const user = await prisma.user.delete({where:{id:userId}})
            if(user){
                revalidatePath(`/panel-admin/users`)
                return { success:true}
            }
            return{
            success :false,
             errorMesage : "کاربری با این آی دی یافت نشد"
        }
        }catch(error){
            return{
            success :false,
             errorMesage : getErrorMessage(error)
        }    
        }
    }else{
        return{
            success :false,
             errorMesage : "کاربری با این آی دی یافت نشد"
        }
    }
}