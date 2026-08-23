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
    <div className="relative mx-auto w-full max-w-lg rounded-xl border border-slate-700/50 bg-brick-color-light/80 p-6 text-slate-100 shadow-xl">
      {/* Stepper */}
      <div className="flex items-start justify-center mb-10">
        {stepOrder.map((name, index) => {
          const isDone = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          return (
            <Fragment key={name}>
              <span
                className={`flex items-center justify-center rounded-full  size-10 relative ${isDone ? "bg-brick-color" : isActive ? "bg-brick-color/60" : "bg-brick-color/30"}`}
              >
                {index + 1}
                <span className="absolute top-full whitespace-nowrap text-xs mt-1 font-bold">
                  {stepLabels[name]}
                </span>
              </span>
              {index < stepOrder.length - 1 && (
                <span
                  className={`flex-1 h-px mt-5 ${isDone ? "bg-brick-color" : isActive ? "bg-brick-color/60" : "bg-brick-color/30"}`}
                ></span>
              )}
            </Fragment>
          );
        })}
      </div>
      {/* Stepper */}
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
        <Link className="text-amber-500" href={"/login"}>
          وارد شوید
        </Link>
      </div>
    </div>
  );
}

export default Register;
