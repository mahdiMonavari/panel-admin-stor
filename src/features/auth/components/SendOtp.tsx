import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { otpSchema } from "../schema/sendOtp.schema";
import { otpType } from "../types/sendOtp.type";
import otpInputs from "../inputsStructure/otpSend.structure";

type SendOtpProps = {
  onChangePhone: (value: string) => void;
  handleSendOtp: (data: otpType) => void | Promise<void>;
};

function SendOtp({ handleSendOtp, onChangePhone }: SendOtpProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<otpType>({ resolver: zodResolver(otpSchema) });

  const submitHandler = (data: otpType) => {
    onChangePhone(data.phone);
    handleSendOtp(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold text-cream-card">ثبت‌نام</h2>
        <div className="mx-auto mb-2 h-px w-5/12 bg-linear-to-r from-transparent via-cream-accent-bright to-transparent" />
        <p className="text-sm text-cream-card/80">
          شماره موبایل خود را وارد کنید
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-4"
      >
        {otpInputs.map((input) => (
          <div
            key={input.name}
            className="group relative flex flex-col gap-1.5"
          >
            <label
              htmlFor={input.name}
              className="text-sm font-medium text-cream-border"
            >
              {input.label}
            </label>
            <input
              id={input.name}
              maxLength={11}
              inputMode="numeric"
              placeholder={input.placeholder}
              type={input.type}
              {...register(input.name)}
              className={`w-full border-b-4 bg-transparent px-1 py-1.5 text-sm text-cream-text/90 outline-none transition-all duration-500 placeholder:text-cream-muted/70 focus:border-cream-accent-bright group-hover:border-cream-muted ${
                errors[input.name]
                  ? "border-cream-danger"
                  : "border-cream-border"
              }`}
            />
            {errors[input.name]?.message && (
              <span className="text-xs text-cream-danger">
                {errors[input.name]?.message}
              </span>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-cream-accent px-4 py-2.5 font-medium text-cream-surface 
          transition hover:bg-cream-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "در حال ارسال..." : "ارسال کد"}
        </button>
      </form>
    </div>
  );
}

export default SendOtp;
