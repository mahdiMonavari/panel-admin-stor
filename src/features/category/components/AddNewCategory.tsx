import Modal from "@/src/components/modal/Modal";
import NavyButton from "@/src/components/navyButton/NavyButton";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { CreateCategoryType } from "../type/create.type";
import CreateCategorySchema from "../schema/create.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiCloseFill } from "react-icons/ri";
import { createInputs } from "./inputs/create/inputs";
import Input from "@/src/components/input/Input";
import generateNewCategory from "../actions/create.action";

const AddNewCategory = ({
  isAddOpen,
  setIsAddOpen,
  id,
  title,
}: {
  isAddOpen: boolean;
  setIsAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: null | string;
  title: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formId = "create-new-parent-category";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategorySchema),
  });
  const createNewCategory = (data: CreateCategoryType) => {
    setError(null);
    startTransition(async () => {
      const res = await generateNewCategory({ ...data, parentId: id });
      if (!res.success) {
        setError(res.message);
      } else {
        setIsAddOpen(false);
      }
    });
  };

  return (
    <div className="">
      <Modal
        form={formId}
        open={isAddOpen}
        setClose={setIsAddOpen}
        isLoading={isPending}
        errorMessage={error}
        onConfirm={() => handleSubmit(createNewCategory)()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-red-500 text-2xl font-Morabba-Bold">{title}</h2>
          <span>
            <button
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full
                             transition-colors duration-500 hover:bg-slate-400 h-5 w-5 flex items-center justify-center"
            >
              <RiCloseFill size={50} />
            </button>
          </span>
        </div>
        <form
          id={formId}
          onSubmit={handleSubmit(createNewCategory)}
          className="flex flex-col gap-5 mt-5"
        >
          {createInputs.map((input) => (
            <Input
              key={input.name}
              errors={errors}
              label={input.label}
              name={input.name}
              placeholder={input.placeHolder}
              register={register}
            />
          ))}
        </form>
      </Modal>
    </div>
  );
};
export default AddNewCategory;
