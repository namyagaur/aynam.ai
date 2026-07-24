import { AppShell } from "@/components/layout";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">

        {/* Top Bar */}

        <header className="flex h-14 items-center justify-between border-b border-black/5 px-8">

          <span className="text-sm text-black/45">
            Home
          </span>

          <button className="rounded-lg px-3 py-2 text-sm text-black/55 hover:bg-black/5">
            ⌘K
          </button>

        </header>

        {/* Workspace */}

        <div className="flex-1 p-10">

        </div>

      </div>
    </AppShell>
  );
}