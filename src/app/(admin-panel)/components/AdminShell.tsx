"use client";

import { useEffect, useState } from "react";
import AdminPanelTopBar from "./AdminPanelTopBar";
import AdminPanelSidBar from "./AdminPanelSidBar";

type Props = {
  children: React.ReactNode;
};

function AdminShell({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    // اگر در حالت موبایل هستیم و سایدبار باز است
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 640 &&
      isSidebarOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function برای وقتی که کامپوننت Unmount می‌شود
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);
  return (
    <div className="flex min-h-screen relative w-full">
      <div
        className={`shrink-0 transition-[width] duration-800 ease-in-out hidden sm:block h-screen sticky top-0 right-0 bottom-0 ${
          isSidebarOpen ? "w-64" : "w-5"
        }`}
      >
        <AdminPanelSidBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
      </div>
      <div
        className={`${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        absolute
         transition-all duration-800 inset-0 sm:hidden bg-black/30
         h-full`}
      ></div>
      <div
        className={`sm:hidden fixed h-full top-0 right-0 duration-800 ease-in-out ${isSidebarOpen ? "w-64" : "w-5"}`}
      >
        <AdminPanelSidBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
      </div>
      <div className="flex min-w-0 min-h-full flex-1 flex-col  sm:pr-0">
        <div className="shrink-0">
          <AdminPanelTopBar />
        </div>
        <div className="grow">{children}</div>
      </div>
    </div>
  );
}

export default AdminShell;
