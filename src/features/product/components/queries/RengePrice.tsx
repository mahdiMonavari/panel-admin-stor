"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { MdAttachMoney } from "react-icons/md";

function RangePrice() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [startPrice, setStartPrice] = useState(
    () => searchParams.get("startPrice") ?? "",
  );
  const [endPrice, setEndPrice] = useState(
    () => searchParams.get("endPrice") ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const isUserTyping = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isUserTyping.current) return;
    setStartPrice(searchParams.get("startPrice") ?? "");
    setEndPrice(searchParams.get("endPrice") ?? "");
  }, [searchParams]);

  const handleChange = (
    value: string,
    setter: (v: string) => void,
    otherValue: string,
    isStart: boolean,
  ) => {
    isUserTyping.current = true;
    setter(value);

    const start = isStart ? Number(value) || 0 : Number(otherValue) || 0;
    const end = isStart ? Number(otherValue) || 0 : Number(value) || 0;

    if (value && otherValue && end < start) {
      setError("حداقل قیمت باید کمتر از حداکثر قیمت باشد");
      isUserTyping.current = false;
      return;
    }
    setError(null);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const newStart = isStart ? value : otherValue;
      const newEnd = isStart ? otherValue : value;

      if (newStart) params.set("startPrice", newStart);
      else params.delete("startPrice");

      if (newEnd) params.set("endPrice", newEnd);
      else params.delete("endPrice");

      params.set("page", "1");

      startTransition(() => {
        router.replace(`${pathName}?${params.toString()}`, { scroll: false });
      });

      isUserTyping.current = false;
    }, 600);
  };

  const inputClass = (hasError: boolean) => `
    flex-1 rounded-lg px-3 py-2 text-sm text-right
    bg-white dark:bg-slate-900
    border transition-colors duration-150
    placeholder:text-slate-400 dark:placeholder:text-slate-600
    text-slate-700 dark:text-slate-200
    focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${hasError ? "border-rose-400 dark:border-rose-600" : "border-slate-200 dark:border-slate-700"}
  `;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <MdAttachMoney
          size={18}
          className="text-slate-400 dark:text-slate-500 shrink-0"
        />
        <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          بازه قیمت (تومان)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={startPrice}
          type="text"
          inputMode="numeric"
          placeholder="از"
          onChange={(e) =>
            handleChange(e.target.value, setStartPrice, endPrice, true)
          }
          className={inputClass(!!error)}
        />

        <span className="text-slate-400 dark:text-slate-600 text-xs shrink-0">
          تا
        </span>

        <input
          value={endPrice}
          type="text"
          inputMode="numeric"
          placeholder="تا"
          onChange={(e) =>
            handleChange(e.target.value, setEndPrice, startPrice, false)
          }
          className={inputClass(!!error)}
        />

        {isPending && (
          <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin shrink-0" />
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-500 dark:text-rose-400 text-right">
          {error}
        </p>
      )}
    </div>
  );
}

export default RangePrice;
