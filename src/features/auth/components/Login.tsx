"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import LoginPass from "./loginComponents/LoginPass";
import LoginOtp from "./loginComponents/loginOtp";
import Link from "next/link";
import { LoginPassType } from "../types/loginPass";
import verifyUserLogin from "../actions/verifyLoginPassword.action";
import { useRouter } from "next/navigation";

function Login() {
  const [stateLogin, setStateLogin] = useState<"password" | "otp">("otp");
  const wallpaper = useRef<HTMLImageElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();
  useEffect(() => {
    const zoomInHandler = () => {
      if (wallpaper.current) {
        wallpaper.current.style.transform = "scale(1.06)";
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
  const handleLoginPassword = (data: LoginPassType) => {
    startTransition(async () => {
      const res = await verifyUserLogin(data);
      if (res.success) {
        return router.push("/panel-admin");
        location.reload();
      }
      setError(res.errorMessage || "خطا از سرور دوباره تلاش کنید");
    });
  };
  return (
    <>
      <div>
        <div className="absolute -z-10 inset-0 h-full overflow-hidden">
          <Image
            src="/images/backGround.jpg"
            ref={wallpaper}
            className="transition-all duration-800 object-cover"
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
            <h1 className="text-xl font-Morabba-Bold text-cream-card text-center mb-5">
              به فروشگاه عشق چوبی خوش آمدید
            </h1>
            <div className="mx-auto my-3 h-px w-10/12 bg-linear-to-r from-transparent via-cream-accent-bright to-transparent" />
            <div className="space-y-3">
              <h2 className="text-cream-surface text-center tracking-[0.1rem]">
                نحوه ورود به سایت
              </h2>
              <div className="w-10/12 bg-cream-muted/50 h-10 rounded-md mx-auto relative flex items-center justify-between">
                <span
                  className={`absolute w-[50%] h-full bg-cream-accent-bright top-1/2 -translate-y-1/2 transition-all duration-300 left-0
                    ${stateLogin === "otp" ? "rounded-l-md" : "translate-x-full rounded-r-md"}`}
                ></span>
                <div
                  className={`flex items-center justify-center flex-1 z-50 bg-transparent text-cream-muted transition-all duration-300 hover:cursor-pointer h-full
                    ${stateLogin === "password" && "text-cream-surface"}`}
                  onClick={() => setStateLogin("password")}
                >
                  پسورد
                </div>
                <div
                  className={`flex items-center justify-center flex-1 z-50 bg-transparent text-cream-muted transition-all duration-300 hover:cursor-pointer h-full
                    ${stateLogin === "otp" && "text-cream-surface"}`}
                  onClick={() => setStateLogin("otp")}
                >
                  پیامک
                </div>
              </div>
              <div className="relative">
                <div
                  inert={stateLogin !== "password"}
                  aria-hidden={stateLogin !== "password"}
                  className={`transition-all duration-500 ease-out ${
                    stateLogin === "password"
                      ? "visible relative opacity-100"
                      : "invisible pointer-events-none absolute inset-0 opacity-0 max-h-0"
                  }`}
                >
                  <LoginPass
                    handleLoginPassword={handleLoginPassword}
                    isPending={isPending}
                  />
                </div>
                <div
                  inert={stateLogin !== "otp"}
                  aria-hidden={stateLogin !== "otp"}
                  className={`transition-all duration-500 ease-out ${
                    stateLogin === "otp"
                      ? "visible relative opacity-100"
                      : "invisible pointer-events-none absolute inset-0 opacity-0 max-h-0"
                  }`}
                >
                  <LoginOtp setError={setError} />
                </div>
              </div>
              {error && (
                <div className="bg-cream-danger/30 border border-red-300 rounded-md text-cream-danger py-1 px-3 text-center">
                  {error}
                </div>
              )}
              <div className="mt-6 flex justify-center gap-1 text-sm text-cream-muted">
                <span>حساب کاربری ندارید؟</span>
                <Link
                  className="text-cream-accent transition-colors hover:text-cream-accent-bright"
                  href="/register"
                >
                  ثبت نام کنید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
