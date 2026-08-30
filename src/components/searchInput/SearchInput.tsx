"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";

type SearchInputProps = {
  queryKey?: string;
  placeholder?: string;
};

function SearchInput({
  queryKey = "q",
  placeholder = "جستجو بر اساس نام یا شماره تماس...",
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialValue = searchParams.get(queryKey) ?? "";
  const [search, setSearch] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === (searchParams.get(queryKey) ?? "")) return;

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (search.trim()) {
          params.set(queryKey, search.trim());
        } else {
          params.delete(queryKey);
        }
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, pathname, queryKey, router, searchParams]);

  const handleClear = () => {
    setSearch("");
  };

  return (
    <div className="relative flex items-center h-11 w-full max-w-50">
      {/* آیکون ذره‌بین سمت راست (شروع اینپوت در زبان فارسی) */}
      <div className="pointer-events-none absolute right-3.5 flex items-center text-neutral-400 dark:text-neutral-500">
        <FiSearch className="h-4 w-4" />
      </div>

      {/* اینپوت اصلی */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full rounded-xl border border-neutral-200 bg-white pr-10 pl-10 text-sm font-medium text-neutral-800 placeholder-neutral-400 shadow-sm outline-none transition-all duration-200 hover:border-neutral-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder-neutral-600 dark:hover:border-neutral-700 dark:focus:border-neutral-100 dark:focus:ring-white/5"
      />

      {/* وضعیت لودینگ یا دکمه پاک کردن در سمت چپ */}
      <div className="absolute left-3 flex items-center gap-x-1.5">
        {isPending ? (
          <FiLoader className="h-4 w-4 animate-spin text-neutral-500 dark:text-neutral-400" />
        ) : search ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
            title="پاک کردن"
          >
            <FiX className="h-3 w-3" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default SearchInput;
