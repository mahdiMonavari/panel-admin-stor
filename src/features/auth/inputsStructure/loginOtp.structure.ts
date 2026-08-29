import { otpVerifyType } from "../types/verifyOtptype"

type LoginOtpInputsType = {
    label : string;
    name : keyof otpVerifyType;
    type:"text";
    placeholder : string
}

export const loginOtpInputs :LoginOtpInputsType[]= [
    {
        label:"شماره تلفن",
        name : "phone",
        placeholder : "به عنوان مثال 09129000000",
        type:"text"
    },
    {
        label:"کد تایید",
        name : "code",
        placeholder : "به عنوان مثال 15682",
        type:"text"
    }
]