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

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Practice",
    href: "/practice",
    icon: Mic,
  },
  {
    label: "Insights",
    href: "/feedback",
    icon: Sparkles,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-[var(--border)] bg-[var(--sidebar)]">

      {/* Header */}

      <div className="flex h-20 items-center justify-between px-7">

        {!collapsed && (
          <div className="flex items-center gap-2">

    <h1 className="text-[22px] font-bold tracking-[-0.05em] text-[#17171B]">
        Aynam
    </h1>

    <span className="text-lg">
        ✨
    </span>

</div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-xl p-2 transition hover:bg-black/5"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

      </div>

      {/* Navigation */}

      <nav className="mt-6 flex flex-col gap-1 px-4">

        {navItems.map((item) => {
          const Icon = item.icon;

          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex h-11 items-center rounded-xl transition-all duration-200",
                collapsed
                  ? "justify-center"
                  : "gap-3 px-4",
                active
                  ? "bg-[#F2ECFF] text-[#5E4AE3]"
                  : "text-[#55556B] hover:bg-[#F6F3FF] hover:text-[#18181B]"
              )}
            >
              <Icon size={18} strokeWidth={1.8} />

              {!collapsed && (
                <span className="text-[15px] font-medium">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

      </nav>

      <div className="flex-1" />

      {/* Settings */}

      <div className="px-4 pb-6">

        <Link
          href="/settings"
          className={clsx(
            "flex h-14 items-center rounded-xl transition-all duration-200",
            collapsed
              ? "justify-center"
              : "gap-3 px-4",
            pathname.startsWith("/settings")
              ? "bg-[var(--purple-soft)] text-[var(--purple)]"
              : "text-[var(--muted)] hover:bg-black/5 hover:text-[var(--text)]"
          )}
        >
          <Settings size={18} strokeWidth={1.8} />

          {!collapsed && (
            <span className="text-[15px] font-medium">
              Settings
            </span>
          )}
        </Link>

      </div>

    </aside>
  );
}