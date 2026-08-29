"use client";

import { useState } from "react";
import AdminPanelTopBar from "./AdminPanelTopBar";
import AdminPanelSidBar from "./AdminPanelSidBar";

type Props = {
  children: React.ReactNode;
};

function AdminShell({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full">
      <div
        className={`shrink-0 transition-[width] duration-800 ease-in-out hidden sm:block ${
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
         h-screen`}
      ></div>
      <div
        className={`sm:hidden absolute inset-0 duration-800 ease-in-out ${isSidebarOpen ? "w-64" : "w-5"}`}
      >
        <AdminPanelSidBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
      </div>
      <div className="flex min-w-0 min-h-full flex-1 flex-col pr-5 sm:pr-0">
        <div className="shrink-0">
          <AdminPanelTopBar />
        </div>
        <div className="grow">{children}</div>
      </div>
    </div>
  );
}

export default AdminShell;
