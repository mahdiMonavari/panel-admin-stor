import { CreateCategoryType } from "../../../type/create.type";

type CreateInputsType = {
  name: keyof CreateCategoryType;
  placeHolder: string;
  label: string;
  type: "text";
};
export const createInputs: CreateInputsType[] = [
  {
    name: "name",
    placeHolder: "نام دسته مورد نظر را وارد کنید",
    label: "نام دسته بندی",
    type: "text",
  },
];
