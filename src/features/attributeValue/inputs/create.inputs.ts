import { CreateAttributeValue } from "../type/create.type";

type inputs = {
  name: keyof CreateAttributeValue;
  placeholder: string;
  label: string;
  type: "text";
};

export const createAttibuteValueInputs: inputs[] = [
  {
    name: "label",
    placeholder: "مثلا 256 گیگابایت | 256GB",
    label: "مقداری که کاربر میبیند",
    type: "text",
  },
  {
    name: "value",
    placeholder: "256GB",
    label: "مقداری به شکل لاتین",
    type: "text",
  },
  {
    name: "code",
    placeholder: "#f22b64",
    label: "کد رنگ (اختیاری)",
    type: "text",
  },
];
