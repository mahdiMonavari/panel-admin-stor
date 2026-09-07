import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpType } from "../../types/sendOtp.type";
import { otpSchema } from "../../schema/sendOtp.schema";
import otpInputs from "../../inputsStructure/otpSend.structure";
import { inputVerifyOtp } from "../../inputsStructure/otpVerify.structure";
import { otpVerifyType } from "../../types/verifyOtptype";
import { otpVerifySchema } from "../../schema/verifyotp.schema";
import sendOtp from "../../actions/sendOtp.action";
import { LoginOtpHandler } from "../../actions/verifyLoginOtp.action";
import { useRouter } from "next/navigation";

const OTP_COUNTDOWN = 100;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

const fieldClassName = (hasError: boolean) =>
  `w-full border-b-4 bg-transparent px-1 py-1.5 text-sm text-cream-card outline-none transition-all duration-500 placeholder:text-cream-muted/70 focus:border-cream-accent-bright group-hover:border-cream-muted ${
    hasError ? "border-cream-danger" : "border-cream-border"
  }`;

function LoginOtp({
  setError,
}: {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [counter, setCounter] = useState(OTP_COUNTDOWN);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOtpSend) return;

    intervalRef.current = setInterval(() => {
      setCounter((prev) => {
        prev === 0 && setIsOtpSend(false);
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isOtpSend]);
  const {
    register: registerSendOtp,
    handleSubmit: handleSubmitSendOtp,
    formState: { errors: sendOtpErrors },
  } = useForm<otpType>({
    resolver: zodResolver(otpSchema),
    mode: "onTouched",
  });

  const {
    reset,
    register: registerVerifyOtp,
    handleSubmit: handleSubmitVerifyOtp,
    formState: { errors: verifyOtpErrors },
  } = useForm<otpVerifyType>({
    resolver: zodResolver(otpVerifySchema),
    mode: "onTouched",
  });

  const handleSendOtp = (data: otpType) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await sendOtp(data);

        if (res.success) {
          const remainingSeconds = res.counter
            ? Math.ceil(res.counter / 1000)
            : OTP_COUNTDOWN;

          setCounter(remainingSeconds);
          reset({ phone: data.phone });
          setIsOtpSend(true);

          return;
        }
      } catch (caughtError) {
        setError(
          getErrorMessage(caughtError, "خطا از سمت سرور دوباره تلاش کنید"),
        );
      }
    });
  };

  const handleVerifyOtp = (data: otpVerifyType) => {
    startTransition(async () => {
      setError(null);
      try {
        const res = await LoginOtpHandler(data);
        if (!res.success) {
          if (res.counter === 0) {
            setCounter(0);
            setIsOtpSend(false);
            return;
          }
          return setError(
            res.errorMessage || "خطای غیر منتظره دوباره تلاش کنید",
          );
        }
        return router.push("/panel-admin");
      } catch (caughtError) {
        setError(
          getErrorMessage(caughtError, "خطا در ارسال کد. دوباره تلاش کنید."),
        );
      }
    });
  };

  const onButtonClick = isOtpSend
    ? handleSubmitVerifyOtp(handleVerifyOtp)
    : handleSubmitSendOtp(handleSendOtp);

  const showCountdownOverlay = isOtpSend && counter > 0;

  const buttonContent = (() => {
    if (counter <= 0) return "دریافت مجدد    کد";

    if (isPending) {
      return (
        <span className="flex items-center gap-2">
          در حال پردازش...
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      );
    }

    return isOtpSend ? "ورود" : "دریافت کد";
  })();

  return (
    <div className="">
      <div className="">
        <h2 className="text-cream-surface text-center mt-10 tracking-[0.2rem] font-bold">
          شماره تلفن خود را وارد کنید
        </h2>

        <div className="mx-auto my-3 h-px w-5/12 bg-linear-to-r from-transparent via-cream-accent-bright to-transparent" />

        <form onSubmit={handleSubmitSendOtp(handleSendOtp)} className="mb-3">
          {otpInputs.map((input) => (
            <div
              key={input.name}
              className="group relative flex flex-col gap-1.5"
            >
              <label
                htmlFor={input.name}
                className="text-sm font-medium text-cream-border"
              />

              <input
                disabled={isOtpSend}
                id={input.name}
                maxLength={11}
                inputMode="numeric"
                placeholder={input.placeholder}
                type={input.type}
                {...registerSendOtp(input.name)}
                className={fieldClassName(Boolean(sendOtpErrors[input.name]))}
              />

              {sendOtpErrors[input.name]?.message && (
                <span className="text-xs text-cream-danger">
                  {sendOtpErrors[input.name]?.message}
                </span>
              )}
            </div>
          ))}
        </form>

        <form
          onSubmit={handleSubmitVerifyOtp(handleVerifyOtp)}
          className="overflow-hidden transition-all duration-500 opacity-100 visible"
          style={{ maxHeight: `${isOtpSend ? "64px" : "0px"}` }}
        >
          {inputVerifyOtp.map((input) => (
            <div
              key={input.name}
              className="group relative flex flex-col gap-1.5"
            >
              <label
                htmlFor={input.name}
                className="text-sm font-medium text-cream-border"
              />

              <input
                id={input.name}
                maxLength={5}
                inputMode="numeric"
                placeholder={input.placeholder}
                type={input.type}
                {...registerVerifyOtp(input.name)}
                className={fieldClassName(Boolean(verifyOtpErrors[input.name]))}
              />

              {verifyOtpErrors[input.name]?.message && (
                <span className="text-xs text-cream-danger">
                  {verifyOtpErrors[input.name]?.message}
                </span>
              )}
            </div>
          ))}
        </form>

        <button
          onClick={onButtonClick}
          type="submit"
          disabled={isPending}
          className="bg-cream-accent-bright w-full mt-5 h-10 flex items-center justify-center rounded-md text-cream-surface
              hover:cursor-pointer hover:bg-cream-accent-dark transition-all duration-300
              disabled:bg-cream-accent-dark disabled:cursor-not-allowed relative overflow-hidden"
        >
          {showCountdownOverlay && (
            <span
              className="absolute inset-0 z-10 bg-cream-muted/50 transition-transform duration-1000 ease-linear"
              style={{ transform: `translateX(${counter}%)` }}
            />
          )}
          {buttonContent}
        </button>
      </div>
    </div>
  );
}

export default LoginOtp;
