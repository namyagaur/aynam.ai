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
      radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--theme-primary-soft) 52%, transparent) 0%, transparent 28%),
      radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--theme-accent) 18%, transparent) 0%, transparent 26%),
      radial-gradient(circle at 70% 80%, color-mix(in srgb, var(--theme-primary) 18%, transparent) 0%, transparent 32%),
      linear-gradient(135deg, var(--theme-primary-soft) 0%, var(--theme-surface) 55%, var(--theme-background) 100%)
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

        <div className="flex h-[calc(100%-72px)] min-h-0">

          <Sidebar />

          <section className="min-h-0 flex-1 overflow-y-auto bg-[var(--theme-surface)]">
            {children}
          </section>

        </div>

      </div>

    </div>
  );
}
