"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

const sidebarWidth = collapsed ? 88 : 300;
  return (
    <div className="flex h-screen bg-[var(--window)]">
      <aside
        style={{ width: sidebarWidth }}
        className="transition-all duration-300 ease-out"
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      <main className="flex-1 bg-[var(--workspace)]">
        {children}
      </main>
    </div>
  );
}