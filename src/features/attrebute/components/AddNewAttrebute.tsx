"use client";
import Modal from "@/src/components/modal/Modal";
import NavyButton from "@/src/components/navyButton/NavyButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaChevronDown, FaCheck } from "react-icons/fa";
import { createAttributeType } from "../type/createAttribute.type";
import { createAttributeInputs } from "./inputs/createAttribute/inputs";
import {
  AttrebuteEnum,
  AttrebuteEnumType,
  createAttributeSchema,
} from "../schema/createAttribute.schema";
import { createAttribute } from "../actions/attribute.create";

function AddNewAttrebute() {
  const [isAddOpen, setIsAddOPen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<createAttributeType>({
    resolver: zodResolver(createAttributeSchema),
    mode: "onTouched",
  });
  useEffect(() => {
    if (!isAddOpen) {
      reset();
    }
  }, [isAddOpen]);

  const selectedType = watch("type");

  const handleSelectType = (value: AttrebuteEnumType[number]) => {
    setValue("type", value, { shouldValidate: true });
    setIsDropdownOpen(false);
  };
  const onConfirm = () => handleSubmit(onSubmit)();
  const onSubmit = (data: createAttributeType) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const res = await createAttribute(data);
      if (res.success) {
        setSuccess(true);
        await new Promise((result) => setTimeout(result, 500));
        reset();
        setIsAddOPen(false);
        setSuccess(false);
        return;
      }
      setError(res.errorMessage as string);
    });
  };

  return (
    <div>
      <Modal
        open={isAddOpen}
        setClose={setIsAddOPen}
        onConfirm={onConfirm}
        isLoading={isPending}
      >
        <div className="w-full p-6 text-slate-800 dark:text-slate-100">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              افزودن ویژگی جدید
            </h3>
            <span className="h-2 w-2 rounded-full bg-teal-500 ring-4 ring-teal-500/20" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {createAttributeInputs.map((input) =>
              input.type === "text" ? (
                <label key={input.name} className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {input.label}
                  </span>
                  <input
                    type="text"
                    {...register(input.name as any)}
                    placeholder={`لطفاً ${input.label} را وارد کنید...`}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-900 dark:focus:ring-teal-400/10"
                  />
                  {errors[input.name as keyof createAttributeType] && (
                    <span className="text-xs font-medium text-rose-500 dark:text-rose-400">
                      {
                        errors[input.name as keyof createAttributeType]
                          ?.message as string
                      }
                    </span>
                  )}
                </label>
              ) : (
                <div key={input.name} className="relative flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {input.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium transition-all hover:bg-slate-100/70 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-850 dark:focus:border-teal-400 dark:focus:ring-teal-400/10"
                  >
                    <span
                      className={
                        selectedType
                          ? "text-slate-900 dark:text-slate-100"
                          : "text-slate-400 dark:text-slate-500"
                      }
                    >
                      {selectedType || "انتخاب نوع ویژگی..."}
                    </span>
                    <FaChevronDown
                      className={`text-xs text-slate-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-teal-500" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      <ul className="absolute top-full z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-2xl">
                        {AttrebuteEnum.map((value) => {
                          const isSelected = selectedType === value;
                          return (
                            <li
                              key={value}
                              onClick={() => handleSelectType(value)}
                              className={`flex cursor-pointer items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                                isSelected
                                  ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                              }`}
                            >
                              <span>{value}</span>
                              {isSelected && (
                                <FaCheck className="text-xs text-teal-600 dark:text-teal-400" />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}

                  {errors.type && (
                    <span className="text-xs font-medium text-rose-500 dark:text-rose-400">
                      {errors.type.message}
                    </span>
                  )}
                </div>
              ),
            )}
          </form>
          {error && (
            <span className="bg-rose-600/30 mt-5 px-3 py-1 text-rose-900 rounded-md block">
              {error}
            </span>
          )}
          {success && (
            <span className="bg-green-600/30 mt-5 px-3 py-1 text-green-900 rounded-md block">
              ویژگی با موفقیت ایجاد شد
            </span>
          )}
        </div>
      </Modal>

      <NavyButton
        text="ایجاد ویژگی جدید"
        onClick={() => setIsAddOPen(true)}
        Icon={<FaPlus />}
      />
    </div>
  );
}

export default AddNewAttrebute;
