"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 72 : 320;

  return (
<div className="flex h-screen overflow-hidden bg-[#F4F4F1]">      
  <aside
  style={{ width: sidebarWidth }}
  className="shrink-0 border-r border-black/5 transition-all duration-300"
>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#F8F8F6] px-16 py-14">
        {children}
      </main>
    </div>
  );
}