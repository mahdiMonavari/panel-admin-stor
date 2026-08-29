"use client";

import { useState } from "react";
import AdminPanelSidBar from "./AdminPanelSidBar";
import AdminPanelTopBar from "./AdminPanelTopBar";

type Props = {
  children: React.ReactNode;
};

function AdminShell({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full">
      <div
        className={`shrink-0 transition-[width] duration-800 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-5"
        }`}
      >
        <AdminPanelSidBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminPanelTopBar />
        {children}
      </div>
    </div>
  );
}

export default AdminShell;
