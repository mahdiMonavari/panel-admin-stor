import React, { Dispatch, SetStateAction } from "react";
import { FaTableCells } from "react-icons/fa6";
import { FaIdCard } from "react-icons/fa";

type ViewToggleProps = {
  isCardView: boolean;
  setIsCardView: Dispatch<SetStateAction<boolean>>;
};

function ViewToggle({ isCardView, setIsCardView }: ViewToggleProps) {
  return (
    <div className="flex items-center">
      <div
        className="gap-x-1 rounded-xl border border-neutral-200
       bg-white h-11 w-48 flex items-center justify-center shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <button
          onClick={() => setIsCardView(false)}
          className={`flex items-center gap-x-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            !isCardView
              ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
        >
          <FaTableCells className="h-4 w-4" />
          <span>جدولی</span>
        </button>

        <button
          onClick={() => setIsCardView(true)}
          className={`flex items-center gap-x-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            isCardView
              ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
        >
          <FaIdCard className="h-4 w-4" />
          <span>کارتی</span>
        </button>
      </div>
    </div>
  );
}

export default ViewToggle;
