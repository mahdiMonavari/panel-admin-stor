import { useForm } from "react-hook-form";
import { otpType } from "../types/sendOtp.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "../schema/sendOtp.schema";
import otpInputs from "../inputsStructure/otpSend.structure";

type SendOtpProps = {
  onChangePhone: (value: string) => void;
  handleSendOtp: (data: otpType) => void | Promise<void>;
};

function SendOtp({ handleSendOtp, onChangePhone }: SendOtpProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<otpType>({
    resolver: zodResolver(otpSchema),
  });

  const submitHandler = (data: otpType) => {
    onChangePhone(data.phone);
    handleSendOtp(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold text-slate-100">ثبت‌نام</h2>
        <p className="text-sm text-slate-400">شماره موبایل خود را وارد کنید</p>
      </div>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-4"
      >
        {otpInputs.map((input) => (
          <div key={input.name} className="flex flex-col gap-1.5">
            <label
              htmlFor={input.name}
              className="text-sm font-medium text-slate-300"
            >
              {input.label}
            </label>

            <input
              id={input.name}
              placeholder={input.placeholder}
              type={input.type}
              {...register(input.name)}
              className={`w-full rounded-lg border bg-slate-800 px-4 py-2.5 text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-[#5BC0BE] focus:ring-1 focus:ring-[#5BC0BE]/40 ${
                errors[input.name] ? "border-red-500" : "border-slate-700"
              }`}
            />

            {errors[input.name]?.message && (
              <span className="text-xs text-red-400">
                {errors[input.name]?.message}
              </span>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-brick-color px-4 py-2.5 font-medium text-white transition hover:bg-brick-color-dark disabled:cursor-not-allowed disabled:opacity-60"
        ></button>
      </form>
    </div>
  );
}

export default SendOtp;
