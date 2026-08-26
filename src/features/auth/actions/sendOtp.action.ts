"use server"

import { prisma } from "@/src/lib/prisma";
import { otpSchema } from "../schema/sendOtp.schema";
import { limitRateKey } from "@/src/types/global.type";
import sendSms from "@/src/app/api/sendSms";

type SendOtpResolteType={
    success:true
    counter ?: number
} |
{success : false , errorMessage ?: string , fieldeError ?: {phoe : string}} 

const API_KEY = process.env.API_KEY;
const PATTERN_CODE = process.env.PATTERN_CODE;
const FROM_NUMBER = process.env.FROM_NUMBER;
const MAX_GET_OTP = 30

export default async function sendOtp(rowData : unknown) : Promise<SendOtpResolteType>{
    const parsed = otpSchema.safeParse(rowData)
    if(!parsed.success){
        return {
            success : false,
            fieldeError : {phoe : "شماره تلفن صحیح نمیباشد"}
        }
    }
    if(!API_KEY || !FROM_NUMBER || !PATTERN_CODE){
        return {
            success : false,
            errorMessage : "مشکل از سرور"
        }   
    }
    try{
        
    const {phone} = parsed.data
    const newDate = new Date()
    await prisma.otp.deleteMany({
        where:{
            expiresAt : {
                lt : newDate
            }            
        }
    })
    const isOtpExist = await prisma.otp.findFirst({
        where :{
            phone,            
        }
    })  
    
      
    if(isOtpExist){        
        const residualTime = new Date(isOtpExist.expiresAt).getTime() - newDate.getTime()
        return{
            success:true,
            counter : residualTime
        }
    }    
    const key : limitRateKey= "otp"
    await prisma.rateLimit.deleteMany({
        where:{
            phone,
            key,
            expiresAt:{
                lt: newDate
            }
        }
    })
    const otpLimitRate = await prisma.rateLimit.findUnique({
        where:{
            phone_key:{
                phone,
                key
            }            
        }
    })
    if(otpLimitRate){
        const canGetOtp = otpLimitRate.count < MAX_GET_OTP
        if(!canGetOtp){
            return {
                success : false,
                errorMessage : "به سقف دریافت کد روزانه رسیدید"
            }
        }        
    }
    const verificationCode = Math.floor(Math.random() * 90000) + 10000;
    const expiryDate = new Date(Date.now() + 100_000);

    const requestBody = {
      code: PATTERN_CODE,
      attributes: { code: verificationCode },
      recipient: phone,
      line_number: FROM_NUMBER,
      number_format: "english",
    };    
    const res = await sendSms(API_KEY , requestBody)
    
    
    if(!res){
        return {
            success : false,
            errorMessage : "خطا در ارسال کد"
        }
    }
    if(otpLimitRate){
        await prisma.rateLimit.update({
            where :{
                id:otpLimitRate.id
            },
            data :{
                count : {
                    increment : 1
                }
            }
        })
    }else{
        await prisma.rateLimit.create({
            data:{
                key,
                phone,
                expiresAt : new Date(newDate.getTime() + (1000 * 60 * 60 *24))
            }
        })
    }
    const newOtp = await prisma.otp.create({
        data:{
            phone,
            code :String(verificationCode),
            expiresAt : expiryDate
        }
    })
    
    
    return { 
        success:true
    }
    }catch(error){
        
        return{
            success:false,
            errorMessage : "ایراد از سمت سرور"
        }        
    }
}