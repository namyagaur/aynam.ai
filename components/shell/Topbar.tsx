"use client";

import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  return (
    <header
      className="
        flex
        h-[72px]
        items-center
        justify-between
        border-b
        border-black/[0.05]
        bg-white/40
        px-7
        backdrop-blur-xl
      "
    >
      {/* macOS */}

      <div className="flex items-center gap-3">

        <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <div className="h-3 w-3 rounded-full bg-[#28C840]" />

      </div>

      {/* Search */}

      <div
        className="
          flex
          h-12
          w-[540px]
          items-center
          rounded-2xl
          border
          border-black/[0.05]
          bg-white/70
          px-5
        "
      >

        <Search
          size={18}
          className="text-[#7B7B88]"
        />

        <input
          placeholder="Search anything or type a command..."
          className="
            ml-3
            flex-1
            bg-transparent
            outline-none
            text-[15px]
          "
        />

        <span className="text-[#8B8B97] text-sm">
          ⌘ K
        </span>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <Bell
          size={20}
          className="text-[#59596A]"
        />

        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-full bg-[#DDD]" />

          <span className="font-medium">
            Namya
          </span>

          <ChevronDown size={16} />

        </div>

      </div>

    </header>
  );
}