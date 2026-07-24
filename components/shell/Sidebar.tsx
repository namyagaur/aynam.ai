"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Mic,
  Sparkles,
  History,
  Settings,
  Sparkle,
  PanelLeftClose,
} from "lucide-react";

const navItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: House,
  },
  {
    title: "Practice",
    href: "/practice",
    icon: Mic,
  },
  {
    title: "Insights",
    href: "/feedback",
    icon: Sparkles,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
  className="w-[300px] border-r border-black/5"
  style={{
    background: `
      radial-gradient(
        circle at 12% 8%,
        rgba(255,248,220,.55) 0%,
        transparent 28%
      ),

      radial-gradient(
        circle at 100% 100%,
        rgba(193,219,232,.18) 0%,
        transparent 45%
      ),

      radial-gradient(
        circle at 60% 75%,
        rgba(139,115,255,.08) 0%,
        transparent 40%
      ),

      linear-gradient(
        180deg,
        #FCFBFF 0%,
        #F8F4FF 45%,
        #F4EEF9 100%
      )
    `,
  }}
>
  <div className="flex h-full flex-col px-7 py-7">
        {/* Header */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <h1 className="text-[22px] font-bold tracking-[-0.05em] text-[#1C1C24]">
              Aynam
            </h1>

            <Sparkle
              size={17}
              className="fill-[#8665FF] text-[#8665FF]"
            />

          </div>

          <button
            className="
            rounded-xl
            p-2
            transition
            hover:bg-white/60
            "
          >
            <PanelLeftClose size={19} />
          </button>

        </div>

        {/* Navigation */}

        <nav className="mt-10 flex flex-col gap-2">

          {navItems.map((item) => {

            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (

              <Link
                key={item.href}
                href={item.href}
                className={`
                flex
                h-14
                items-center
                gap-4
                rounded-[20px]
px-4
                transition-all
                ${
                  active
                    ? "bg-gradient-to-r from-[#EEE7FF] to-[#F8F5FF] shadow-[0_10px_30px_rgba(135,95,255,.10)] text-[#6D58EA]"
                    : "text-[#57576A] hover:bg-white/60"
                }
                `}
              >

                <Icon
                  size={20}
                  strokeWidth={1.8}
                />

                <span className="text-[16px] font-medium">
                  {item.title}
                </span>

              </Link>

            );

          })}

        </nav>

        <div className="flex-1" />

        {/* Settings */}

        <div className="pb-2">

          <Link
            href="/settings"
            className="
            flex
            h-14
            items-center
            gap-4
            rounded-2xl
            px-5
            text-[#57576A]
            hover:bg-white/60
            "
          >

            <Settings
              size={20}
              strokeWidth={1.8}
            />

            <span className="text-[16px] font-medium">
              Settings
            </span>

          </Link>

        </div>

      </div>

    </aside>
  );
}