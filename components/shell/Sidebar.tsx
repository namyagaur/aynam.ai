"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
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
    href: "/insights",
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
  async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = "/sign-in";
}
  return (
    <aside
  className="w-[252px] border-r border-black/5"
  style={{
    background: `
      radial-gradient(
        circle at 12% 8%,
        color-mix(in srgb, var(--theme-primary-soft) 48%, transparent) 0%,
        transparent 28%
      ),

      radial-gradient(
        circle at 100% 100%,
        color-mix(in srgb, var(--theme-accent) 14%, transparent) 0%,
        transparent 45%
      ),

      radial-gradient(
        circle at 60% 75%,
        color-mix(in srgb, var(--theme-primary) 8%, transparent) 0%,
        transparent 40%
      ),

      linear-gradient(
        180deg,
        var(--theme-surface-elevated) 0%,
        var(--theme-surface) 45%,
        var(--theme-background) 100%
      )
    `,
  }}
>
  <div className="flex h-full flex-col px-5 py-6">
        {/* Header */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <h1 className="text-[22px] font-bold tracking-[-0.05em] text-[var(--theme-text)]">
              Aynam
            </h1>

            <Sparkle
              size={17}
              className="fill-[var(--theme-accent)] text-[var(--theme-accent)]"
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
            <PanelLeftClose size={17} />
          </button>

        </div>

        {/* Navigation */}

        <nav className="mt-8 flex flex-col gap-1.5">

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
                h-12
                items-center
                gap-3
                rounded-2xl
px-3.5
                transition-all
                ${
                  active
                    ? "bg-gradient-to-r from-[var(--theme-primary-soft)] to-[var(--theme-surface-elevated)] shadow-[0_10px_30px_rgba(135,95,255,.10)] text-[var(--theme-primary)]"
                    : "text-[var(--theme-text-muted)] hover:bg-white/60"
                }
                `}
              >

                <Icon
                  size={18}
                  strokeWidth={1.8}
                />

                <span className="text-[15px] font-medium">
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
            h-12
            items-center
            gap-3
            rounded-2xl
            px-3.5
            text-[var(--theme-text-muted)]
            hover:bg-white/60
            "
          >

            <Settings
              size={18}
              strokeWidth={1.8}
            />

            <span className="text-[15px] font-medium">
              Settings
            </span>

          </Link>

        </div>

      </div>

    </aside>
  );
}
