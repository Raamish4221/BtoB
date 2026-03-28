"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Dashboard({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell h-screen overflow-hidden">
      <div className="flex h-full">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
