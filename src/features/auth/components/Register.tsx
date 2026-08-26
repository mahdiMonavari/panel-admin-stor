"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import CreateUserForm from "./registerComponents/CreateUserForm";
import SendOtp from "./SendOtp";
import VerifyOtp from "./VerifyOtp";
import { otpType } from "../types/sendOtp.type";
import { otpVerifyType } from "../types/verifyOtptype";
import { UserType } from "../types/register.type";
import Image from "next/image";
import sendOtp from "../actions/sendOtp.action";
import { verifyOtp } from "../actions/verifyOtp.ation";
import { createNewUser } from "../actions/register.action";
import { useRouter } from "next/navigation";

type RegisterStep = "phone" | "otp" | "form";

const stepLabels: Record<RegisterStep, string> = {
  phone: "شماره موبایل",
  otp: "تأیید کد",
  form: "اطلاعات کاربری",
};

const stepOrder: RegisterStep[] = ["phone", "otp", "form"];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function Register() {
  const [step, setStep] = useState<RegisterStep>("phone");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const currentStepIndex = stepOrder.indexOf(step);
  const wallpaper = useRef<HTMLImageElement | null>(null);
  const [counter, setCounter] = useState<number>(100);
  const router = useRouter();
  useEffect(() => {
    const zoomInHandler = () => {
      if (wallpaper.current) {
        wallpaper.current.style.transform = "scale(1.2)";
      }
    };
    const zoomOutHandler = () => {
      if (wallpaper.current) {
        wallpaper.current.style.transform = "scale(1)";
      }
    };
    document.addEventListener("focusin", zoomInHandler);
    document.addEventListener("focusout", zoomOutHandler);
  }, []);

  function handleSendOtp(data: otpType) {
    setError(null);
    try {
      startTransition(async () => {
        const res = await sendOtp(data);
        console.log(res);
        if (res.success) {
          if (res.counter) {
            setCounter(Math.ceil(res.counter / 1000));
          }
          setPhone(data.phone);
          setStep("otp");
        } else {
          if (res.fieldeError) {
            setError(res.fieldeError.phoe);
          } else {
            setError(res.errorMessage || "خطای غیر منتظره ، دوباره تلاش کنید");
          }
        }
      });
    } catch (caughtError: unknown) {
      setError(
        getErrorMessage(caughtError, "خطا در ارسال کد. دوباره تلاش کنید."),
      );
    }
  }

  function handleVerifyOtp(data: otpVerifyType) {
    setError(null);
    try {
      startTransition(async () => {
        const res = await verifyOtp(data);
        if (!res.success) {
          if (res.counter === 0) {
            setCounter(0);
          }
          return setError(
            res.errorMessage || "حطای غیر منتظره دوباره تلاش کنید",
          );
        }
        setStep("form");
      });
    } catch (caughtError: unknown) {
      setError(
        getErrorMessage(caughtError, "خطا در ارسال کد. دوباره تلاش کنید."),
      );
    }
  }

  function handleFinalRegister(data: UserType) {
    setError(null);
    try {
      startTransition(async () => {
        const res = await createNewUser(data);
        if (res.success) {
          router.push("/");
          return location.reload();
        }
        if (res.errorMessage) {
          setError(res.errorMessage);
        }
      });
    } catch (caughtError: unknown) {
      setError(
        getErrorMessage(caughtError, "خطا در ارسال کد. دوباره تلاش کنید."),
      );
    }
  }
  function handleChangeNumber(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    setStep("phone");
    e.preventDefault();
  }
  return (
    <div className={`${step === "form" ? "" : "overflow-hidden"}`}>
      <div className="absolute -z-10 inset-0 h-full overflow-hidden">
        <Image
          src="/images/backGround.jpg"
          ref={wallpaper}
          className="transition-all duration-800 object-cover sm:hidden"
          fill
          alt=""
        ></Image>
        <div className="relative h-full">
          <div className="absolute inset-0 bg-black/40 z-50 w-screen"></div>
        </div>
      </div>
      <div className="container">
        <div
          className="relative mx-auto w-full sm:max-w-md max-w-85 rounded-3xl border border-cream-border/60 my-2
     bg-cream-text/55 p-6 text-cream-text shadow-2xl shadow-cream-accent-dark/15 backdrop-blur-[2px] sm:p-6"
        >
          <h1 className="text-4xl font-serif font-bold text-cream-card text-center mb-5">
            به فروشگاه ما خوش آمدید
          </h1>
          <div className="mx-auto mb-5 h-px w-10/12 bg-linear-to-r from-transparent via-cream-accent-bright to-transparent" />
          <div className="mb-10 flex items-start justify-center">
            {stepOrder.map((name, index) => {
              const isDone = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <Fragment key={name}>
                  <div className="relative flex flex-col items-center">
                    <span
                      className={`relative flex size-10 items-center justify-center rounded-full border border-cream-border/70 text-sm font-bold ${
                        isDone
                          ? "bg-cream-accent text-cream-surface"
                          : isActive
                            ? "bg-cream-accent/60 text-cream-text"
                            : "bg-cream-card/60 text-cream-muted"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="absolute top-full mt-1 whitespace-nowrap text-xs font-bold text-cream-card/80">
                      {stepLabels[name]}
                    </span>
                  </div>
                  {index < stepOrder.length - 1 && (
                    <span
                      className={`mt-5 h-px flex-1 ${
                        isDone ? "bg-cream-accent" : "bg-cream-border/60"
                      }`}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>

          {isPending && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center gap-2 rounded-3xl bg-cream-surface/70 text-sm text-cream-muted backdrop-blur-md"
              aria-live="polite"
            >
              در حال پردازش
              <span
                role="status"
                aria-label="در حال بارگذاری"
                className="h-5 w-5 animate-spin rounded-full border-2 border-cream-border border-t-cream-accent"
              />
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-cream-danger/25 bg-cream-danger/10 px-4 py-2.5 text-xs text-cream-danger"
            >
              {error}
            </div>
          )}

          <div className="relative">
            <div
              aria-hidden={step !== "phone"}
              inert={step !== "phone"}
              className={`transition-[opacity,visibility] duration-500 ease-out ${
                step === "phone"
                  ? "visible relative opacity-100"
                  : "invisible pointer-events-none absolute inset-0 opacity-0"
              }`}
            >
              <SendOtp onChangePhone={setPhone} handleSendOtp={handleSendOtp} />
            </div>
            <div
              aria-hidden={step !== "otp"}
              inert={step !== "otp"}
              className={`transition-[opacity,visibility] duration-500 ease-out ${
                step === "otp"
                  ? "visible relative opacity-100"
                  : "invisible pointer-events-none absolute inset-0 opacity-0"
              }`}
            >
              <VerifyOtp
                handleChangeNumber={handleChangeNumber}
                handleVerifyOtp={handleVerifyOtp}
                isActive={currentStepIndex === 1}
                counter={counter}
                setCounter={setCounter}
                phone={phone}
              />
            </div>
            <div
              aria-hidden={step !== "form"}
              inert={step !== "form"}
              className={`transition-[opacity,visibility] duration-500 ease-out ${
                step === "form"
                  ? "visible relative opacity-100"
                  : "invisible pointer-events-none absolute inset-0 opacity-0"
              }`}
            >
              <CreateUserForm
                handleFinalRegister={handleFinalRegister}
                phone={phone}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-1 text-sm text-cream-muted">
            <span>حساب کاربری دارید؟</span>
            <Link
              className="text-cream-accent transition-colors hover:text-cream-accent-dark"
              href="/login"
            >
              وارد شوید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
