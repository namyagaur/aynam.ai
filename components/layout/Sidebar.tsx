"use client";

import {
  House,
  Mic,
  History,
  Settings,
  Sparkles,
} from "lucide-react";

import NavigationItem from "./NavigationItem";

export default function Sidebar() {
  return (
    <aside
      className="
        flex
        h-full
        w-full
        flex-col
        rounded-[24px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-6
        shadow-[var(--shadow)]
      "
    >
      {/* Brand */}

      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight">
          Aynam
        </h1>

        <p className="mt-1 text-sm text-[var(--text-muted)]">
          AI Communication Coach
        </p>
      </div>

      {/* Navigation */}

      <nav className="space-y-2">

        <NavigationItem
          href="/dashboard"
          label="Home"
          icon={House}
        />

        <NavigationItem
          href="/practice"
          label="Practice"
          icon={Mic}
        />

        <NavigationItem
          href="/feedback"
          label="Insights"
          icon={Sparkles}
        />

        <NavigationItem
          href="/history"
          label="History"
          icon={History}
        />

      </nav>

      <div className="flex-1" />

      {/* Today's Practice */}

      <div
        className="
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface-alt)]
          p-5
        "
      >
        <p className="text-sm text-[var(--text-muted)]">
          Today's Practice
        </p>

        <h2 className="mt-2 text-3xl font-semibold">
          18 min
        </h2>

        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Keep your streak alive.
        </p>
      </div>

      <div className="mt-6">

        <NavigationItem
          href="/settings"
          label="Settings"
          icon={Settings}
        />

      </div>
    </aside>
  );
}