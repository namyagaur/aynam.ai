"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Mic,
  History,
  Settings,
} from "lucide-react";

const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: House,
  },
  {
    name: "Practice",
    href: "/practice",
    icon: Mic,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-72 border-r border-white/10 bg-[#0B1020] px-6 py-8">

      {/* Logo */}

      <div>

        <h1 className="text-3xl font-semibold text-white">
          Aynam
        </h1>

        <p className="mt-1 text-sm text-white/50">
          Find your voice.
        </p>

      </div>

      {/* Navigation */}

      <nav className="mt-14 space-y-2">

        {links.map((link) => {

          const Icon = link.icon;

          const active = pathname === link.href;

          return (

            <Link
              key={link.href}
              href={link.href}
              className={`
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              transition

              ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }
              `}
            >

              <Icon size={20} />

              <span>{link.name}</span>

            </Link>

          );
        })}

      </nav>

      {/* Bottom */}

      <div className="absolute bottom-8">

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">

          <p className="text-sm text-white/50">
            Current Streak
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            🔥 12 Days
          </h2>

        </div>

      </div>

    </aside>
  );
}