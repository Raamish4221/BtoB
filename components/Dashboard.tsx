"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Dashboard({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 min-w-0">
          <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
