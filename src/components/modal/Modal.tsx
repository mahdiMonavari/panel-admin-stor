"use client";

import React, { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { RiCloseFill } from "react-icons/ri";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  setClose: (open: boolean) => void; // برای بستن
  title?: string; // عنوان اختیاری
  children: React.ReactNode; // محتوای داخل مودال (هرچیزی که بخوای)
  onConfirm?: () => void; // کال‌بک برای دکمه تایید
  confirmLabel?: string;
  cancelLabel?: string;
  showFooter?: boolean; // آیا فوتر (دکمه‌ها) نمایش داده شود؟
  footer?: React.ReactNode; // اگر بخواهی دکمه‌های سفارشی بگذاری
  isLoading?: boolean; // برای حالت لودینگ هنگام ارسال فرم
  errorMessage?: string | null;
  form?: string;
}

export default function Modal({
  open,
  setClose,
  title,
  children,
  onConfirm,
  confirmLabel = "تأیید",
  cancelLabel = "انصراف",
  showFooter = true,
  footer,
  isLoading = false,
  errorMessage,
  form,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {};
  }, []);
  if (!mounted) return null;
  if (typeof document === "undefined") {
    return null;
  }
  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 dark:bg-slate-900/10 backdrop-blur-sm p-4 transition-all duration-300
        ${open ? "visible opacity-100" : "opacity-0 invisible"}`}
      onClick={() => setClose(false)}
    >
      <div
        className={`relative w-full max-w-lg dark:bg-neutral-900 bg-neutral-200 border border-slate-700/50 rounded-2xl
             shadow-2xl shadow-blue-500/10 transition-all duration-150 delay-200
            ${
              open
                ? "scale-100 visible opacity-100"
                : "scale-90 opacity-0 invisible"
            }`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold dark:text-slate-100 text-slate-800">
              {title}
            </h3>
            <button
              onClick={() => setClose(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full
               transition-colors duration-500 hover:bg-slate-400 h-5 w-5 flex items-center justify-center"
            >
              <RiCloseFill size={50} />
            </button>
          </div>
        )}

        <div className="px-6 py-6">{children}</div>
        {showFooter && (
          <div className="flex items-center justify-end gap-3 px-6 pb-3 pt-2 border-t border-slate-800">
            {footer ? (
              footer
            ) : (
              <>
                <button
                  onClick={() => setClose(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-400 dark:bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors duration-200"
                >
                  {cancelLabel}
                </button>
                <button
                  type="submit"
                  onClick={onConfirm}
                  form={form}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#1e3a8a] hover:bg-[#1d4ed8] rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-blue-900/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      در حال پردازش...
                    </span>
                  ) : (
                    confirmLabel
                  )}
                </button>
              </>
            )}
          </div>
        )}
        {errorMessage && (
          <div className="px-6">
            <div
              className="flex items-center gap-2 w-full px-3.5 py-2.5 mb-3 rounded-xl
             bg-rose-500/10 border border-rose-500/20 text-rose-500
             text-xs sm:text-sm font-medium leading-relaxed
             backdrop-blur-sm shadow-xs transition-all animate-in fade-in zoom-in-95 duration-200"
            >
              <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
