import { otpSchema } from "../schema/sendOtp.schema";

type SendOtpResolteType={
    success:true
} | 
{success : false , errorMessage ?: string , fieldeError ?: {phoe : string}}

const API_KEY = process.env.API_KEY;
const PATTERN_CODE = process.env.PATTERN_CODE;
const FROM_NUMBER = process.env.FROM_NUMBER;

export default async function sendOtp(rowData : unknown) : Promise<SendOtpResolteType>{
    const parsed = otpSchema.safeParse(rowData)
    if(!parsed.success){
        return {
            success : false,
            fieldeError : {phoe : "شماره تلفن صحیح نمیباشد"}
        }
    }
    return { 
        success:true
    }
}