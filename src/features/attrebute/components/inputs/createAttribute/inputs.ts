import { createAttributeType } from "../../../type/createAttribute.type";

type inputs = {
  name: keyof createAttributeType;
  placeholder?: string;
  label: string;
  type: "select" | "text";
};

export const createAttributeInputs: inputs[] = [
  {
    name: "name",
    label: "اسم ویژگی به انگلیسی",
    placeholder: "مثلا : RAM",
    type: "text",
  },
  {
    name: "label",
    label: "اسم به فارسی",
    type: "text",
  },
  {
    name: "type",
    label: "تایین نوع مقادیر",
    type: "select",
  },
];
