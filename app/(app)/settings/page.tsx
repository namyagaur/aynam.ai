"use client";

import { useEffect, useState } from "react";
import { LogOut, User, Shield, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    <main className="min-h-full bg-[#FFFDF7] px-10 py-10">
      <div className="mx-auto max-w-[900px]">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.04em] text-[#1C1C24]">
            Settings
          </h1>

          <p className="mt-2 text-[14px] text-[#858594]">
            Manage your account and Aynam preferences.
          </p>
        </div>

        {/* Account */}

        <section className="mt-8 rounded-[24px] border border-[#EAE7EE] bg-white p-6 shadow-[0_8px_30px_rgba(60,45,110,.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EEFF]">
              <User className="h-[17px] w-[17px] text-[#7565F5]" />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-[#25252B]">
                Account
              </h2>

              <p className="text-[12px] text-[#9999A4]">
                Your Aynam account
              </p>
            </div>
          </div>

          <div className="my-5 h-px bg-[#F0EEF2]" />

          {/* Name */}

          <div>
            <label className="text-[12px] font-medium text-[#39393E]">
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
                border border-[#E4E3E7]
                bg-[#FCFCFB]
                px-3.5
                text-[13px]
                text-[#27272B]
                outline-none
                transition
                focus:border-[#B9B2F2]
                focus:ring-4
                focus:ring-[#7565F5]/[0.07]
              "
            />
          </div>

          {/* Email */}

          <div className="mt-4">
            <label className="text-[12px] font-medium text-[#39393E]">
              Email
            </label>

            <div
              className="
                mt-1.5
                flex
                h-[42px]
                items-center
                rounded-xl
                border border-[#EAE8ED]
                bg-[#F7F6F8]
                px-3.5
                text-[13px]
                text-[#858590]
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
                bg-[#292A2E]
                px-4
                py-2.5
                text-[13px]
                font-medium
                text-white
                transition
                hover:bg-[#1F2023]
                disabled:opacity-60
              "
            >
              {saved && <Check className="h-4 w-4" />}
              {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
            </button>
          </div>

          <div className="my-6 h-px bg-[#F0EEF2]" />

          {/* Sign out */}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#303036]">
                Sign out
              </p>

              <p className="mt-1 text-[12px] text-[#9999A4]">
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
                border border-[#E7E4EA]
                bg-white
                px-4
                py-2.5
                text-[13px]
                font-medium
                text-[#4A4A52]
                transition
                hover:bg-[#FAF8FC]
              "
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </section>

        {/* Privacy */}

        <section className="mt-4 rounded-[24px] border border-[#EAE7EE] bg-white p-6 shadow-[0_8px_30px_rgba(60,45,110,.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F4F8]">
              <Shield className="h-[17px] w-[17px] text-[#777783]" />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-[#25252B]">
                Privacy
              </h2>

              <p className="mt-0.5 text-[12px] text-[#9999A4]">
                Your recordings and communication data stay private.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}