import { FaChevronLeft } from "react-icons/fa";

type AdminPanelSidBarType = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};
function AdminPanelSidBar({
  isSidebarOpen,
  onToggleSidebar,
}: AdminPanelSidBarType) {
  return (
    <div className="bg-amber-100 relative h-full">
      <div
        className={`${isSidebarOpen ? "w-64 transition-all duration-300 delay-500" : "w-0"} overflow-hidden`}
      >
        AdminPanelSidBar
      </div>
      <button
        className="absolute bg-amber-100 top-1/2 -translate-y-1/2 z-50 size-10 flex
        items-center justify-center rounded-full left-0 -translate-x-1/2"
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
