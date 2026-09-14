"use client";

import { useEffect, useState } from "react";
import { LogOut, User, Shield, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { theme, setTheme, availableThemes } = useTheme();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile) {
        setName(profile.full_name ?? "");
      }
    }

    loadProfile();
  }, []);

 async function handleSave() {
  setSaving(true);
  setSaved(false);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("USER:", user);

  if (!user) {
    console.log("NO USER FOUND");
    setSaving(false);
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select();

  console.log("PROFILE UPDATE DATA:", data);
  console.log("PROFILE UPDATE ERROR:", error);

  if (error) {
    setSaving(false);
    return;
  }

  setSaved(true);
  setSaving(false);

  setTimeout(() => setSaved(false), 2000);
}

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  }

  return (
    <main className="min-h-full bg-[var(--theme-surface)] px-10 py-10">
      <div className="mx-auto max-w-[900px]">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.04em] text-[var(--theme-text)]">
            Settings
          </h1>

          <p className="mt-2 text-[14px] text-[var(--theme-text-muted)]">
            Manage your account and Aynam preferences.
          </p>
        </div>

        {/* Account */}

        <section className="mt-8 rounded-[24px] border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] p-6 shadow-[0_8px_30px_rgba(60,45,110,.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--theme-primary-soft)]">
              <User className="h-[17px] w-[17px] text-[var(--theme-primary)]" />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-[var(--theme-text)]">
                Account
              </h2>

              <p className="text-[12px] text-[var(--theme-text-muted)]">
                Your Aynam account
              </p>
            </div>
          </div>

          <div className="my-5 h-px bg-[var(--theme-border)]" />

          {/* Name */}

          <div>
            <label className="text-[12px] font-medium text-[var(--theme-text)]">
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="
                mt-1.5
                h-[42px]
                w-full
                rounded-xl
                border border-[var(--theme-border)]
                bg-[var(--theme-surface)]
                px-3.5
                text-[13px]
                text-[var(--theme-text)]
                outline-none
                transition
                focus:border-[var(--theme-accent)]
                focus:ring-4
                focus:ring-[var(--theme-primary)]/[0.07]
              "
            />
          </div>

          {/* Email */}

          <div className="mt-4">
            <label className="text-[12px] font-medium text-[var(--theme-text)]">
              Email
            </label>

            <div
              className="
                mt-1.5
                flex
                h-[42px]
                items-center
                rounded-xl
                border border-[var(--theme-border)]
                bg-[var(--theme-surface)]
                px-3.5
                text-[13px]
                text-[var(--theme-text-muted)]
              "
            >
              {email}
            </div>
          </div>

          {/* Save */}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-[var(--theme-primary)]
                px-4
                py-2.5
                text-[13px]
                font-medium
                text-white
                transition
                hover:bg-[var(--theme-accent)]
                disabled:opacity-60
              "
            >
              {saved && <Check className="h-4 w-4" />}
              {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
            </button>
          </div>

          <div className="my-6 h-px bg-[var(--theme-border)]" />

          {/* Sign out */}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[var(--theme-text)]">
                Sign out
              </p>

              <p className="mt-1 text-[12px] text-[var(--theme-text-muted)]">
                Sign out of Aynam on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border border-[var(--theme-border)]
                bg-white
                px-4
                py-2.5
                text-[13px]
                font-medium
                text-[var(--theme-text)]
                transition
                hover:bg-[var(--theme-primary-soft)]
              "
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </section>

        {/* Appearance */}

        <section className="mt-4 rounded-[24px] border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] p-6 shadow-[0_8px_30px_rgba(60,45,110,.04)]">
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--theme-text)]">
              Appearance
            </h2>
            <p className="mt-1 text-[12px] text-[var(--theme-text-muted)]">
              Choose the color atmosphere that feels right for you.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {availableThemes.map((themeDefinition) => {
              const isSelected = theme === themeDefinition.id;
              const { tokens } = themeDefinition;

              return (
                <button
                  key={themeDefinition.id}
                  type="button"
                  onClick={() => setTheme(themeDefinition.id)}
                  aria-pressed={isSelected}
                  className="relative min-w-0 rounded-2xl border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: tokens.surface,
                    borderColor: isSelected ? tokens.primary : tokens.border,
                  }}
                >
                  <span
                    className="block h-10 rounded-xl p-1.5"
                    style={{ backgroundColor: tokens.background }}
                  >
                    <span className="flex h-full items-center gap-1 rounded-lg px-1.5" style={{ backgroundColor: tokens.surfaceElevated }}>
                      <span className="h-4 flex-1 rounded-full" style={{ backgroundColor: tokens.primary }} />
                      <span className="h-4 w-4 rounded-full" style={{ backgroundColor: tokens.accent }} />
                      <span className="h-4 w-4 rounded-full" style={{ backgroundColor: tokens.primarySoft }} />
                    </span>
                  </span>

                  <span className="mt-2 block truncate text-[12px] font-medium" style={{ color: tokens.text }}>
                    {themeDefinition.name}
                  </span>

                  {isSelected && (
                    <span
                      className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full text-white"
                      style={{ backgroundColor: tokens.primary }}
                      aria-label={`${themeDefinition.name} selected`}
                    >
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Privacy */}

        <section className="mt-4 rounded-[24px] border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] p-6 shadow-[0_8px_30px_rgba(60,45,110,.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F4F8]">
              <Shield className="h-[17px] w-[17px] text-[#777783]" />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-[var(--theme-text)]">
                Privacy
              </h2>

              <p className="mt-0.5 text-[12px] text-[var(--theme-text-muted)]">
                Your recordings and communication data stay private.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
