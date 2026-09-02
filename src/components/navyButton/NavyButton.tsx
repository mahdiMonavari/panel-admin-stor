"use client";

import React from "react";

type NavyButtonType = {
  text: string;
  onClick?: () => void;
  isLoading?: boolean;
  Icon?: React.ReactNode;
};

const NavyButton = ({ text, onClick, isLoading, Icon }: NavyButtonType) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 bg-neutral-900 hover:bg-[#1e293b] text-white font-medium rounded-lg 
                 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg cursor-pointer
                 active:scale-95 border border-slate-700/50"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          در حال پردازش...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {text}
          {Icon}
        </span>
      )}
    </button>
  );
};

export default NavyButton;
