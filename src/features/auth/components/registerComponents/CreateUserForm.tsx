import { SubmitHandler, useForm } from "react-hook-form";
import { UserType } from "../../types/register.type";
import { inputsCreateUser } from "../../inputsStructure/register.structure";

type CreateUserFormProps = {
  handleFinalRegister: (data: UserType) => void;
  phone: string;
};

function CreateUserForm({ handleFinalRegister, phone }: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserType>({
    mode: "onBlur",
    defaultValues: { phone },
  });

  const onSubmit: SubmitHandler<UserType> = (data) => {
    handleFinalRegister(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold text-slate-100">تکمیل اطلاعات</h2>
        <p className="text-sm text-slate-400">لطفاً اطلاعات خود را وارد کنید</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {inputsCreateUser.map((input) => {
            const fieldName = input.name as keyof UserType;
            const fieldError = errors[fieldName];
            const isPhone = fieldName === "phone";

            return (
              <div key={String(input.name)} className="flex flex-col gap-1.5">
                <label
                  htmlFor={String(input.name)}
                  className="text-sm font-medium text-slate-300"
                >
                  {input.label}
                </label>

                <input
                  readOnly={isPhone}
                  disabled={isPhone}
                  id={String(input.name)}
                  type={input.type}
                  placeholder={input.placeholder}
                  {...register(fieldName, {
                    required: `${input.label} الزامی است`,
                  })}
                  className={`w-full rounded-lg border bg-slate-800 px-4 py-2.5 outline-none transition-colors placeholder:text-slate-500 focus:border-[#5BC0BE] focus:ring-1 focus:ring-[#5BC0BE]/40 ${
                    fieldError ? "border-red-500" : "border-slate-700"
                  } ${
                    isPhone
                      ? "cursor-not-allowed text-slate-500"
                      : "text-slate-100"
                  }`}
                />

                {fieldError && (
                  <span className="text-xs text-red-400">
                    {String(fieldError.message)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#5BC0BE] px-4 py-2.5 font-medium text-slate-950 transition hover:bg-[#4aa9a7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <span
              aria-label="در حال ارسال"
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-800/30 border-t-slate-950"
            />
          )}
          {isSubmitting ? "در حال ثبت اطلاعات..." : "ثبت اطلاعات"}
        </button>
      </form>
    </div>
  );
}

export default CreateUserForm;
