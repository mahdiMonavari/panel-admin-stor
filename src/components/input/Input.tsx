import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type InputsProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors;
  name: Path<T>;
  placeholder: string;
  label: string;
};

function Input<T extends FieldValues>({
  register,
  errors,
  name,
  label,
  placeholder,
}: InputsProps<T>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <input
        type="text"
        {...register(name)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm
                         text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500
                          focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-900/60
                           dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-900
                            dark:focus:ring-teal-400/10"
      />
      {errors[name] && (
        <span className="text-xs font-medium text-rose-500 dark:text-rose-400">
          {errors[name]?.message as string}
        </span>
      )}
    </label>
  );
}

export default Input;
