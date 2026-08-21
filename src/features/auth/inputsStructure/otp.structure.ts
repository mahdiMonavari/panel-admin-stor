import { otpType } from "../types/otp.type"

type inputsType = {
    placeholder: string,
    type : "text",
    name : keyof otpType,
    label : string
}

const otpInputs : inputsType[] = [
    {
        placeholder: "مثلا : 09121234567",
        type : "text",
        name : "phone",
        label : "شماره تماس"
    }
]
export default otpInputs