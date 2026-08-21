import { otpVerifyType } from "../types/verifyOtptype"

type inputsType = {
    placeholder: string,
    type : "text" ,
    name : keyof otpVerifyType,
    label : string
}
export const inputVerifyOtp : inputsType[]= [
    {
       placeholder:"به فرض مثال : 45879",
        type:"text",
        name:"code",
        label :"کد تایید",
    }
]