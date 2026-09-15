"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import {
  Bell,
  Search,
  ChevronDown,
  Flower2,
  LogOut,
} from "lucide-react";

export default function Topbar() {
  const [name, setName] = useState("Learner");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  };

  return (
    <header
      className="
        relative
        z-50
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
          className="text-[var(--theme-text-muted)]"
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

        <span className="text-[var(--theme-text-muted)] text-sm">
          ⌘ K
        </span>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <Bell
          size={20}
          className="text-[var(--theme-text-muted)]"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-3 rounded-lg font-medium text-[var(--theme-text)]"
          >
            <Flower2 size={14} className="text-[var(--theme-accent)]" aria-hidden="true" />
            <span>{name}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          {isMenuOpen ? (
            <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-36 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] p-1.5 shadow-[0_10px_30px_rgba(59,23,34,.12)]">
              <button type="button" role="menuitem" onClick={() => void handleSignOut()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] font-medium text-[var(--theme-primary)] transition hover:bg-[var(--theme-accent-soft)]">
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          ) : null}
        </div>

      </div>

    </header>
  );
}
