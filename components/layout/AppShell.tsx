import { ReactNode } from "react";
import Sidebar from "./Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <div className="mx-auto flex h-screen max-w-[1700px] gap-6 p-6">

        {/* Sidebar */}

        <div className="w-[290px] shrink-0">
          <Sidebar />
        </div>

        {/* Workspace */}

        <main
          className="
            flex-1
            overflow-y-auto
            rounded-[28px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[var(--shadow)]
          "
        >
          <div className="min-h-full p-10">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}