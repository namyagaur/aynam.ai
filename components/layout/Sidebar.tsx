"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  House,
  Mic,
  Sparkles,
  History,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkle,
} from "lucide-react";

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
    <aside
      className="
      flex
      h-full
      flex-col
      border-r
      border-[#ECE8F6]
      bg-gradient-to-b
      from-[#FCFBFF]
      via-[#FAF8FF]
      to-[#F6F2FF]
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between px-8 pt-8">

        {!collapsed && (

          <div className="flex items-center gap-2">

            <h1 className="text-[24px] font-bold tracking-[-0.05em] text-[#17171B]">
              Aynam
            </h1>

            <Sparkle
              size={18}
              className="fill-[#8B6BFF] text-[#8B6BFF]"
            />

          </div>

        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-xl p-2 transition hover:bg-white"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

      </div>

      {/* NAVIGATION */}

      <nav className="mt-12 flex flex-col gap-3 px-6">

        {navItems.map((item) => {

          const Icon = item.icon;

          const active = pathname.startsWith(item.href);

          return (

            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex h-14 items-center rounded-2xl transition-all duration-300",

                collapsed
                  ? "justify-center"
                  : "gap-4 px-5",

                active
                  ? "bg-gradient-to-r from-[#EEE7FF] to-[#F8F5FF] shadow-[0_8px_30px_rgba(135,95,255,.08)] text-[#6F55F6]"
                  : "text-[#58586C] hover:bg-white/60"
              )}
            >

              <Icon size={21} strokeWidth={1.9} />

              {!collapsed && (
                <span className="text-[17px] font-medium">
                  {item.label}
                </span>
              )}

            </Link>

          );

        })}

      </nav>

      <div className="flex-1" />

      {/* SETTINGS */}

      <div className="px-6 pb-8">

        <Link
          href="/settings"
          className="flex h-14 items-center gap-4 rounded-2xl px-5 text-[#58586C] hover:bg-white/60"
        >

          <Settings
            size={20}
            strokeWidth={1.9}
          />

          {!collapsed && (
            <span className="text-[17px] font-medium">
              Settings
            </span>
          )}

        </Link>

      </div>

    </aside>
  );
}