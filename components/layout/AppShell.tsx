import { ReactNode } from "react";

type AppShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export default function AppShell({
  sidebar,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <div className="mx-auto flex h-screen max-w-[1600px] gap-6 p-6">

        {/* Sidebar */}

        <aside className="w-[280px] shrink-0">
          {sidebar}
        </aside>

        {/* Main */}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}