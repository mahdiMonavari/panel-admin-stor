"use client";

type NavyButtonType = {
  text: string;
  onClick?: () => void;
};

const NavyButton = ({ text, onClick }: NavyButtonType) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 bg-neutral-900 hover:bg-[#1e293b] text-white font-medium rounded-lg dark:bg-white dark:text-neutral-900
                 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg cursor-pointer dark:hover:bg-neutral-200
                 active:scale-95 border border-slate-700/50"
    >
      {text}
    </button>
  );
};

export default NavyButton;
