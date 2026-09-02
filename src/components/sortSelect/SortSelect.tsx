"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

export type SortOption = {
  value: string;
  label: string;
};

type SortSelectProps = {
  options: SortOption[];
  queryKey: string;
};

function SortSelect({ queryKey, options }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentValue = searchParams.get(queryKey) ?? "";
  const currentOption =
    options.find((option) => option.value === currentValue) ?? options[0];

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(queryKey, value);
    } else {
      params.delete(queryKey);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-right">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center justify-between gap-x-2 rounded-xl border
         border-neutral-200 bg-white px-4 h-11 text-sm font-medium text-neutral-700 shadow-sm
          transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950
           dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <span>{currentOption?.label || "انتخاب کنید"}</span>
        <FaChevronDown
          className={`h-3 w-3 opacity-50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg transition-all duration-200 ease-out dark:border-neutral-800 dark:bg-neutral-950 ${
          isOpen
            ? "visible translate-y-0 opacity-100 scale-100"
            : "invisible -translate-y-2 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <ul className="py-2 text-sm text-neutral-700 dark:text-neutral-200">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`cursor-pointer px-3 mx-2 rounded-lg py-2 my-0.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                currentValue === option.value
                  ? "bg-neutral-100 font-semibold text-neutral-900 dark:bg-neutral-900 dark:text-white"
                  : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SortSelect;
