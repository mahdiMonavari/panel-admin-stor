"use client";

import { useState, useTransition } from "react";
import SendOtp from "./SendOtp";
import { otpType } from "../types/sendOtp.type";
import { otpVerifyType } from "../types/verifyOtptype";
import { UserType } from "../types/register.type";
import VerifyOtp from "./VerifyOtp";
import CreateUserForm from "./registerComponents/CreateUserForm";
import { Fragment } from "react";
import Link from "next/link";

type RegisterStep = "phone" | "otp" | "form";

const stepLabels: Record<RegisterStep, string> = {
  phone: "شماره موبایل",
  otp: "تأیید کد",
  form: "اطلاعات کاربری",
};

const stepOrder: RegisterStep[] = ["phone", "otp", "form"];

function Register() {
  const [step, setStep] = useState<RegisterStep>("phone");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentStepIndex = stepOrder.indexOf(step);

  const handleSendOtp = (data: otpType) => {
    setError(null);
    try {
      startTransition(async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        // await sendOtpApi(data.phone);
        setPhone(data.phone);
        setStep("otp");
      });
    } catch (err: any) {
      setError(err.message || "خطا در ارسال کد. دوباره تلاش کنید.");
    }
  };

  const handleVerifyOtp = (data: otpVerifyType) => {
    setError(null);
    try {
      startTransition(async () => {
        // await verifyOtpApi(phone, data.code);
      });
      setStep("form");
    } catch (err: any) {
      setError(err.message || "خطا در تأیید کد. دوباره تلاش کنید.");
    }
  };

  const handleFinalRegister = (data: UserType) => {
    setError(null);
    try {
      startTransition(async () => {
        // await registerApi({ phone, ...data });
      });
    } catch (err: any) {
      setError(err.message || "خطا در ثبت‌نام. دوباره تلاش کنید.");
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-xl border border-slate-700/50 bg-slate-900 p-6 text-slate-100 shadow-xl">
      {/* Stepper */}
      <div className="mb-6 flex w-full items-center">
        {stepOrder.map((s, i) => {
          const isDone = i < currentStepIndex;
          const isActive = i === currentStepIndex;

          return (
            <Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isDone
                      ? "bg-[#5BC0BE] text-slate-950"
                      : isActive
                        ? "border-2 border-[#5BC0BE] text-[#5BC0BE]"
                        : "border-2 border-slate-700 text-slate-600"
                  }`}
                >
                  {isDone ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[10px] ${
                    isActive ? "text-[#5BC0BE]" : "text-slate-500"
                  }`}
                >
                  {stepLabels[s]}
                </span>
              </div>

              {i < stepOrder.length - 1 && (
                <div
                  className={`mb-4 h-px flex-1 transition-colors ${
                    isDone ? "bg-[#5BC0BE]" : "bg-slate-700"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
      {/* Overlay loading */}
      {isPending && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center gap-2 rounded-xl bg-slate-900/70 text-sm text-slate-300 backdrop-blur-sm"
          aria-live="polite"
        >
          در حال پردازش
          <span
            role="status"
            aria-label="در حال بارگذاری"
            className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-[#5BC0BE]"
          />
        </div>
      )}
      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-500/20 bg-red-950/40 px-4 py-2.5 text-sm text-red-400"
        >
          {error}
        </div>
      )}
      {/* Step content */}
      {step === "phone" && (
        <SendOtp onChangePhone={setPhone} handleSendOtp={handleSendOtp} />
      )}
      {step === "otp" && <VerifyOtp handleVerifyOtp={handleVerifyOtp} />}
      {step === "form" && (
        <CreateUserForm
          handleFinalRegister={handleFinalRegister}
          phone={phone}
        />
      )}
      <div>
        <span>حساب کاربری دارید؟</span>
        <Link className="text-amber-700" href={"/login"}>
          وارد شوید
        </Link>
      </div>
    </div>
  );
}

export default Register;
