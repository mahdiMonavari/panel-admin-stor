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
    if (isSidebarOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen">
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 transition-all duration-800 ${
          isSidebarOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-[min(16rem,calc(100vw-1.25rem))] transition-transform duration-800 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-[calc(100%_-_1.25rem)]"
        }`}
      >
        <AdminPanelSidBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
      </div>

      <div className="flex min-h-full w-full flex-1 flex-col sm:pr-0">
        <div className="shrink-0">
          <AdminPanelTopBar />
        </div>
        <div className="grow min-h-screen">{children}</div>
      </div>
    </div>
  );
}

export default AdminShell;
