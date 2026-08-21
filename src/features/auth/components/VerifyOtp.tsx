import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpVerifyType } from "../types/verifyOtptype";
import { inputVerifyOtp } from "../inputsStructure/otpVerify.structure";
import { otpVerifySchema } from "../schema/verifyotp.schema";

type VerifyOtpType = {
  handleVerifyOtp: (data: otpVerifyType) => void | Promise<void>;
};

function VerifyOtp({ handleVerifyOtp }: VerifyOtpType) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<otpVerifyType>({
    resolver: zodResolver(otpVerifySchema),
  });

  const submitHandler = (data: otpVerifyType) => {
    handleVerifyOtp(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold text-slate-100">تأیید کد</h2>
        <p className="text-sm text-slate-400">
          کد ۵ رقمی ارسال شده را وارد کنید
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-4"
      >
        {inputVerifyOtp.map((input) => (
          <div key={input.name} className="flex flex-col gap-1.5">
            <label
              htmlFor={input.name}
              className="text-sm font-medium text-slate-300"
            >
              {input.label}
            </label>

            <input
              id={input.name}
              {...register(input.name)}
              type={input.type}
              placeholder={input.placeholder}
              maxLength={5}
              inputMode="numeric"
              autoComplete="one-time-code"
              className={`w-full rounded-lg border bg-slate-800 px-4 py-2.5 text-center text-xl tracking-[0.5em] text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-[#5BC0BE] focus:ring-1 focus:ring-[#5BC0BE]/40 ${
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
          disabled={isSubmitting}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#5BC0BE] px-4 py-2.5 font-medium text-slate-950 transition hover:bg-[#4aa9a7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <span
              aria-label="در حال بررسی"
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-800/30 border-t-slate-950"
            />
          )}
          {isSubmitting ? "در حال بررسی..." : "تأیید کد"}
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;
