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
    <div className="dark:bg-neutral-800 bg-neutral-200 relative h-full pl-5">
      <div
        className={`${isSidebarOpen ? "w-64 transition-all duration-300 delay-500" : "w-0"} overflow-hidden h-full`}
      >
        <div className=" flex flex-col justify-between mx-3 h-full">
          <div>
            <h2 className="text-center mt-5 font-Morabba-Bold text-2xl text-nowrap text-neutral-700 dark:text-neutral-300 mb-5">
              پنل مدریت فروشگاه
            </h2>
            <AdminLink />
          </div>
          <button className="w-full rounded-xl cursor-pointer hover:bg-red-500/50 transition-all duration-300 bg-red-300/30 border-red-400 border font-Morabba-Medium mb-5 py-2">
            خروج
          </button>
        </div>
      </div>
      <button
        className="absolute dark:bg-neutral-800 bg-neutral-200 top-1/2 -translate-y-1/2 z-50 size-10 flex
        items-center justify-center rounded-full left-0 -translate-x-1/2 dark:text-gray-300 text-neutral-500 dark:hover:text-neutral-50
        hover:text-neutral-700 transition-all duration-200 hover:*:scale-120 cursor-pointer"
        onClick={onToggleSidebar}
      >
        <FaChevronLeft
          className={`${isSidebarOpen ? "rotate-180" : ""} transition-all duration-800`}
        />
      </button>
    </div>
  );
}

export default AdminPanelSidBar;
