import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { inputVerifyOtp } from "../inputsStructure/otpVerify.structure";
import { otpVerifySchema } from "../schema/verifyotp.schema";
import { otpVerifyType } from "../types/verifyOtptype";
import React, { useEffect, useRef, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type VerifyOtpProps = {
  handleVerifyOtp: (data: otpVerifyType) => void | Promise<void>;
  isActive: boolean;
  handleChangeNumber: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => void;
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  phone: string;
};

function VerifyOtp({
  handleVerifyOtp,
  isActive,
  handleChangeNumber,
  counter,
  setCounter,
  phone,
}: VerifyOtpProps) {
  const interVale = useRef<ReturnType<typeof setInterval>>(null);
  useEffect(() => {
    if (isActive && counter > 0) {
      interVale.current = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interVale.current) {
        clearInterval(interVale.current);
        interVale.current = null;
      }
    };
  }, [isActive, counter]);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<otpVerifyType>({ resolver: zodResolver(otpVerifySchema) });
  useEffect(() => {
    if (phone) {
      setCounter(100);
      reset({ phone, code: "" });
    }
  }, [phone]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold text-cream-card">تأیید کد</h2>
        <div className="mx-auto my-2 h-px w-5/12 bg-linear-to-r from-transparent via-cream-accent-bright to-transparent" />
        <p className="text-sm text-cream-card/70">
          کد پنج رقمی ارسال‌شده را وارد کنید
        </p>
      </div>
      <form
        onSubmit={handleSubmit(handleVerifyOtp)}
        className="flex flex-col gap-4"
      >
        {inputVerifyOtp.map((input) => (
          <div
            key={input.name}
            className="group relative flex flex-col gap-1.5"
          >
            <label
              htmlFor={input.name}
              className="text-sm font-medium text-cream-surface"
            ></label>
            <div className="relative">
              <input
                id={input.name}
                {...register(input.name)}
                type={input.type}
                placeholder={input.placeholder}
                maxLength={5}
                inputMode="numeric"
                autoComplete="one-time-code"
                className={`w-full border-b-4 bg-transparent px-1 py-1.5 text-xl 
                 text-cream-card/70 outline-none transition-all duration-500 placeholder:text-cream-muted
                  focus:border-cream-accent-bright group-hover:border-cream-muted ${
                    errors[input.name]
                      ? "border-cream-danger"
                      : "border-cream-border"
                  }`}
              />
              <span
                onClick={handleChangeNumber}
                className="text-cream-accent-dark font-bold rounded-md px-2 py-0.5 bg-cream-card hover:scale-98
              hover:bg-cream-page transition-all duration-300 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2"
              >
                تغییر شماره
              </span>
            </div>
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
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-cream-accent px-4 py-2.5 font-medium text-cream-surface transition hover:bg-cream-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "در حال بررسی..." : "تأیید کد"}
        </button>
      </form>

      <div className="flex flex-col items-center justify-center">
        {counter !== 0 ? (
          <div className="size-12">
            <CircularProgressbar
              value={counter}
              text={`${counter}`}
              styles={buildStyles({
                strokeLinecap: "butt",
                pathTransitionDuration: 1,
                pathColor: `rgba(141, 87, 49, 1)`,
                textColor: "#eadcc7",
                textSize: "30px",
                trailColor: "#d6d6d6",
                backgroundColor: "#3e98c7",
              })}
            />
          </div>
        ) : (
          <span
            className={`text-cream-accent-dark font-bold rounded-md mt-3 px-2 py-0.5 bg-cream-card
             hover:bg-cream-page transition-all duration-300 cursor-pointer hover:scale-98`}
          >
            ارسال مجدد
          </span>
        )}
      </div>
    </div>
  );
}

export default VerifyOtp;
