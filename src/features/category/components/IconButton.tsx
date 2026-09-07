const IconButton = ({
  title,
  variant = "default",
  onClick,
  children,
}: {
  title: string;
  variant?: "default" | "danger";
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
      variant === "danger"
        ? "border-slate-200 bg-white text-slate-500 hover:border-red-500 hover:text-red-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-500/50 dark:hover:text-red-400"
        : "border-slate-200 bg-white text-slate-500 hover:border-teal-500 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-teal-400 dark:hover:text-teal-400"
    }`}
  >
    {children}
  </button>
);
export default IconButton;
