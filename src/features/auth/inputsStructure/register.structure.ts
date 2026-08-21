import { UserType } from "../types/register.type"

type inputsType = {
    placeholder: string,
    type : "text" | "password",
    name : keyof UserType,
    label : string
}

export const inputsCreateUser : inputsType[] = [
    {
        placeholder:"به فرض مثال : کوروش",
        type:"text",
        name:"firstname",
        label :"نام",
    },
    {
        placeholder:"به فرض مثال : افشاریه",
        type:"text",
        name:"lastname",
        label :"نام خانوادگی",
    },
    {
        placeholder:"به فرض مثال : w25s17k8",
        type:"password",
        name:"password",
        label :"رمز عبور",
    },
    {
        placeholder:"به فرض مثال : 09123456789",
        type:"text",
        name:"phone",
        label :"شماره تماس",
    }
]