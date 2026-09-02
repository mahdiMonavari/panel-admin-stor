import { FaChevronLeft } from "react-icons/fa";
import AdminLink from "./AdminLink";

type AdminPanelSidBarType = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

function AdminPanelSidBar({
  isSidebarOpen,
  onToggleSidebar,
}: AdminPanelSidBarType) {
  return (
    <div className="relative h-full max-h-screen w-full overflow-visible bg-neutral-200 pl-5 dark:bg-neutral-800">
      <div
        className={`h-full overflow-hidden transition-[width] duration-300 ${
          isSidebarOpen ? "w-full" : "w-0"
        }`}
      >
        <div className="mx-3 flex h-full min-w-0 flex-col justify-between">
          <div>
            <h2 className="mb-5 mt-5 whitespace-nowrap text-center font-Morabba-Bold text-2xl text-neutral-700 dark:text-neutral-300">
              پنل مدیریت فروشگاه
            </h2>
            <AdminLink />
          </div>
          <button className="mb-5 w-full cursor-pointer rounded-xl border border-red-400 bg-red-300/30 py-2 font-Morabba-Medium transition-all duration-300 hover:bg-red-500/50">
            خروج
          </button>
        </div>
      </div>
      <button
        aria-label={isSidebarOpen ? "بستن منو" : "باز کردن منو"}
        className="absolute left-0 top-1/2 z-50 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-neutral-200 text-neutral-500 transition-all duration-200 hover:text-neutral-700 hover:*:scale-120 dark:bg-neutral-800 dark:text-gray-300 dark:hover:text-neutral-50"
        onClick={onToggleSidebar}
      >
        <FaChevronLeft
          className={`${isSidebarOpen ? "rotate-180" : ""} transition-transform duration-300`}
        />
      </button>
    </div>
  );
}

export default AdminPanelSidBar;
