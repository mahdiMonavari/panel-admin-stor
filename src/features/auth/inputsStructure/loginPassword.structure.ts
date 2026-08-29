import { LoginPassType } from "../types/loginPass"

type inputsType = {
    placeholder: string,
    type : "text" | "password",
    name : keyof LoginPassType,
    label : string
}
const loginPasswordInputs : inputsType[] = [
    {
        label:"شماره تلفن",
        name : "phone",
        placeholder : "به عنوان مثال 09129000000",
        type:"text"
    },
    {
        label:"رمز عبور",
        name : "password",
        placeholder : "به عنوان مثال wdc451xa",
        type:"password"
    }
]
export default loginPasswordInputs