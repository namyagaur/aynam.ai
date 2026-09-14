"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import {
  Bell,
  Search,
  ChevronDown,
  Flower2,
} from "lucide-react";

export default function Topbar() {
  const [name, setName] = useState("Learner");

  useEffect(() => {
    const loadName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      const fullName = profile?.full_name;
      setName(typeof fullName === "string" && fullName.trim() ? fullName.trim() : "Learner");
    };
    void Promise.resolve().then(loadName);
  }, []);

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
          h-14
          w-[620px]
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

          <Flower2 size={14} className="text-[#7B68D8]" aria-hidden="true" />

          <span className="font-medium">
            {name}
          </span>

          <ChevronDown size={16} />

        </div>

      </div>

    </header>
  );
}
