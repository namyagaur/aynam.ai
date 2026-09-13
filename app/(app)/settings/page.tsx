"use client";

import { supabase } from "@/lib/supabase/client";
import { LogOut, User, Shield } from "lucide-react";

export default function SettingsPage() {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  }

  return (
    <main className="min-h-full bg-[#FFFDF7] px-10 py-10">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}

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
                flex items-center gap-2
                rounded-xl
                border border-[#E7E4EA]
                bg-white
                px-4 py-2.5
                text-[13px] font-medium
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