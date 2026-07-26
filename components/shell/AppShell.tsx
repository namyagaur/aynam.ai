"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "./Topbar";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  return (
    <div
  className="min-h-screen p-3"
  style={{
    background: `
      radial-gradient(circle at 15% 20%, rgba(255,245,200,.55) 0%, transparent 28%),
      radial-gradient(circle at 88% 12%, rgba(197,219,232,.35) 0%, transparent 26%),
      radial-gradient(circle at 70% 80%, rgba(168,148,255,.18) 0%, transparent 32%),
      linear-gradient(135deg,#ECE7F8 0%,#FFF9ED 55%,#F4EEF9 100%)
    `,
  }}
>

      <div
        className="
          mx-auto
          h-[calc(100vh-24px)]
          overflow-hidden
          rounded-[32px]
          border
          border-white/60
          bg-white/45
          shadow-[0_25px_80px_rgba(60,45,110,.12)]
          backdrop-blur-3xl
        "
      >
        <Topbar />

        <div className="flex h-[calc(100%-72px)]">

          <Sidebar />

          <section className="flex-1 bg-[#FFFDF7] overflow-y-auto">
            {children}
          </section>

        </div>

      </div>

    </div>
  );
}