"use client";

import Modal from "@/src/components/modal/Modal";
import NavyButton from "@/src/components/navyButton/NavyButton";
import React, { useEffect, useState, useTransition } from "react";
import { updateUser } from "../actions/user.update";
import { UserType } from "../types/user.type";

type UpdateUserType = {
  fullname: string;
  userId: string;
  role: string;
  isActive: string;
};

const baseRoleBtnStyle =
  "flex h-6 w-28 items-center justify-center rounded-md font-Morabba-Medium text-xs transition-all duration-300";

const baseActiveBtnStyle =
  "flex h-6 w-32 items-center justify-center rounded-md font-Morabba-Medium text-xs transition-all duration-300";

const disabledStyle =
  "border border-neutral-500/30 bg-neutral-500/10 text-neutral-400 dark:bg-neutral-500/20 dark:text-neutral-500 cursor-not-allowed opacity-70";

function UpdateUser({ fullname, userId, role, isActive }: UpdateUserType) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  // استیت‌های هماهنگ با پراپ‌ها و سرور
  const [isUserActive, setIsUserActive] = useState(isActive === "فعال");
  const [currentRole, setCurrentRole] = useState(role);

  // هماهنگی در صورت تغییر مقادیر Props از بیرون
  useEffect(() => {
    setIsUserActive(isActive === "فعال");
    setCurrentRole(role);
  }, [isActive, role]);

  const handleAction = (userFields: Partial<UserType>) => {
    startTransition(async () => {
      setErrorMessage(null);
      try {
        const res = await updateUser(userFields);
        if (!res.success) {
          return setErrorMessage(res.errorMessage);
        }

        // بروزرسانی لوکال استیت‌ها در صورت موفقیت‌آمیز بودن پاسخ سرور
        if (userFields.isBan !== undefined) {
          setIsUserActive(!userFields.isBan);
        }
        if (userFields.role !== undefined) {
          setCurrentRole(userFields.role);
        }
      } catch (error) {
        setErrorMessage(
          typeof error === "string" ? error : "خطایی در عملیات رخ داد",
        );
      }
    });
  };

  const handleSetActive = () => {
    handleAction({ id: userId, isBan: false });
  };

  const handleSetInactive = () => {
    handleAction({ id: userId, isBan: true });
  };

  const handleSetRoleUser = () => {
    handleAction({ id: userId, role: "USER" });
  };

  const handleSetRoleAdmin = () => {
    handleAction({ id: userId, role: "ADMIN" });
  };

  const isRoleUser = currentRole === "USER";

  function closeModal() {
    setIsModalOpen(false);
    setErrorMessage(null);
  }

  return (
    <div>
      <Modal
        isLoading={isPending}
        open={isModalOpen}
        setClose={closeModal}
        footer={
          <NavyButton text="تایید" onClick={closeModal} isLoading={isPending} />
        }
      >
        {/* ── Header ── */}
        <h2 className="text-2x flex items-center gap-2 mb-5">
          <span>
            {isRoleUser ? (
              <span
                className={`border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 ${baseRoleBtnStyle}`}
              >
                کاربر
              </span>
            ) : (
              <span
                className={`border border-red-500/30 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 ${baseRoleBtnStyle}`}
              >
                ادمین
              </span>
            )}
          </span>
          <span>{fullname}</span>
        </h2>

        <span className="block h-px w-full dark:bg-gray-800 bg-gray-300" />

        {/* ── وضعیت ── */}
        <div className="mb-5 pt-5">
          <h2 className="w-full bg-gray-300 dark:bg-gray-800 py-1 rounded-md font-Morabba-Bold text-base text-center mb-2">
            وضعیت
          </h2>
          <div className="flex items-center justify-center gap-2">
            {/* آزادسازی / فعال */}
            <button
              type="button"
              disabled={isUserActive || isPending}
              onClick={handleSetActive}
              className={`${baseActiveBtnStyle} ${
                isUserActive
                  ? disabledStyle
                  : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
              }`}
            >
              {isUserActive ? "کاربر فعال است" : "آزادسازی کاربر"}
            </button>

            {/* قفل کردن / مسدودسازی */}
            <button
              type="button"
              disabled={!isUserActive || isPending}
              onClick={handleSetInactive}
              className={`${baseActiveBtnStyle} ${
                !isUserActive
                  ? disabledStyle
                  : "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
              }`}
            >
              {!isUserActive ? "کاربر قفل است" : "قفل کردن کاربر"}
            </button>
          </div>
        </div>

        <span className="block h-px w-full dark:bg-gray-800 bg-gray-300" />

        {/* ── نقش ── */}
        <div className="mb-5 pt-5">
          <h2 className="w-full bg-gray-300 dark:bg-gray-800 py-1 rounded-md font-Morabba-Bold text-base text-center mb-2">
            نقش
          </h2>
          <div className="flex items-center justify-center gap-2">
            {/* تبدیل به کاربر */}
            <button
              type="button"
              disabled={isRoleUser || isPending}
              onClick={handleSetRoleUser}
              className={`${baseRoleBtnStyle} ${
                isRoleUser
                  ? disabledStyle
                  : "border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 hover:bg-sky-500/20 cursor-pointer"
              }`}
            >
              {isRoleUser ? "نقش: کاربر" : "تبدیل به کاربر"}
            </button>

            {/* تبدیل به ادمین */}
            <button
              type="button"
              disabled={!isRoleUser || isPending}
              onClick={handleSetRoleAdmin}
              className={`${baseRoleBtnStyle} ${
                !isRoleUser
                  ? disabledStyle
                  : "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
              }`}
            >
              {!isRoleUser ? "نقش: ادمین" : "تبدیل به ادمین"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="text-center text-xs text-red-500 mt-2">
            {errorMessage}
          </p>
        )}
      </Modal>

      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg px-2.5 py-1 text-xs font-medium text-sky-600 font-Morabba-Bold transition-colors hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-sky-950/40 cursor-pointer"
      >
        ویرایش
      </button>
    </div>
  );
}

export default UpdateUser;
