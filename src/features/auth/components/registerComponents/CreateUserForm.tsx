import { SubmitHandler, useForm } from "react-hook-form";
import { UserType } from "../../types/register.type";
import { inputsCreateUser } from "../../inputsStructure/register.structure";
import { useEffect } from "react";

type CreateUserFormProps = {
  handleFinalRegister: (data: UserType) => void;
  phone: string;
};

function CreateUserForm({ handleFinalRegister, phone }: CreateUserFormProps) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserType>({
    mode: "onBlur",
  });
  useEffect(() => {
    if (phone) {
      reset({ phone });
    }
  }, [phone]);

  const onSubmit: SubmitHandler<UserType> = (data) => handleFinalRegister(data);
  console.log(errors);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold text-cream-card">تکمیل اطلاعات</h2>
        <p className="text-sm text-cream-card/80">
          لطفاً اطلاعات خود را وارد کنید
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {inputsCreateUser.map((input) => {
            const fieldName = input.name as keyof UserType;
            const fieldError = errors[fieldName];
            const isPhone = fieldName === "phone";

            return (
              <div
                key={String(input.name)}
                className="group relative flex min-w-0 flex-col gap-1.5"
              >
                <label
                  htmlFor={String(input.name)}
                  className="truncate text-sm font-medium text-cream-card"
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
                  className={`w-full border-b-4 bg-transparent px-1 py-1.5 text-sm outline-none transition-all duration-500 placeholder:text-cream-card/70 focus:border-cream-accent-bright group-hover:border-cream-muted ${
                    fieldError ? "border-cream-danger" : "border-cream-border"
                  } ${isPhone ? "cursor-not-allowed text-cream-muted" : "text-cream-card"}`}
                />
                {fieldError && (
                  <span className="text-xs text-cream-danger">
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
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-cream-accent px-4 py-2.5 font-medium text-cream-surface transition hover:bg-cream-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "در حال ثبت اطلاعات..." : "ثبت اطلاعات"}
        </button>
      </form>
    </div>
  );
}

export default CreateUserForm;
