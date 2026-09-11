import { createProductType } from "../../type/product.type";

type inputs = {
  name: keyof createProductType;
  placeholder: string;
  type: "text" | "textarea";
  label: string;
};

export const createProductInput: inputs[] = [
  {
    name: "name",
    label: "اسم کالا",
    placeholder: "مثلا iphone 16 pro max",
    type: "text",
  },
  {
    name: "description",
    label: "توضیحات کوتاه",
    placeholder: "مثلا این موبایل ساخته شده در سال...",
    type: "textarea",
  },
];
