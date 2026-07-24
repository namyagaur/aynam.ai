"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div
      className="
        h-screen
        overflow-hidden
        bg-[linear-gradient(135deg,#E8E5F6_0%,#FDF8EE_55%,#F8F3FF_100%)]
      "
    >
      {/* App Window */}

      <div
        className="
          h-full
          p-2
        "
      >
        <div
          className="
            h-full
            rounded-[28px]
            border
            border-white/60
            bg-white/35
            backdrop-blur-2xl
            shadow-[0_25px_80px_rgba(71,46,120,.12)]
            overflow-hidden
          "
        >
          <Topbar />

          <div className="flex h-[calc(100%-72px)]">

            <Sidebar />

            <main className="flex-1 overflow-y-auto">

              {children}

            </main>

          </div>

        </div>
      </div>
    </div>
  );
}