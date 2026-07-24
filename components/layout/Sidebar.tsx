"use client";

import {
  House,
  Mic,
  History,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import NavigationItem from "./NavigationItem";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  return (
    <aside className="flex h-full flex-col border-r border-black/6 bg-[#ECEBE7] px-4 py-5">
      {/* Brand */}

      <div className="mb-10 flex items-center justify-between">
  {!collapsed && (
    <h1 className="text-2xl font-semibold tracking-tight">
      Aynam
    </h1>
  )}

  <button
    onClick={() => setCollapsed(!collapsed)}
    className="rounded-lg p-2 transition hover:bg-black/5"
  >
    {collapsed ? (
      <PanelLeftOpen size={20} />
    ) : (
      <PanelLeftClose size={20} />
    )}
  </button>
</div>
      
      {/* Navigation */}

      <nav className="space-y-2">

        <NavigationItem
          href="/dashboard"
          label="Home"
          icon={House}
          collapsed={collapsed}
        />

        <NavigationItem
          href="/practice"
          label="Practice"
          icon={Mic}
          collapsed={collapsed}
        />

        <NavigationItem
          href="/feedback"
          label="Insights"
          icon={Sparkles}
          collapsed={collapsed}
        />

        <NavigationItem
          href="/history"
          label="History"
          icon={History}
          collapsed={collapsed}
        />

      </nav>

      <div className="flex-1" />

      {/* Today's Practice */}

      {!collapsed && (
  <div
    className="
      rounded-2xl
      bg-black/5
      p-5
    "
  >
    <h2 className="text-3xl font-semibold">
      18 min
    </h2>

    <p className="mt-2 text-sm text-black/60">
      Keep your streak alive.
    </p>
  </div>
)}
      <div className="mt-6">

        <NavigationItem
          href="/settings"
          label="Settings"
          icon={Settings}
          collapsed={collapsed}
        />

      </div>
    </aside>
  );
}