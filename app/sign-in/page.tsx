"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main
      className="h-screen overflow-hidden p-2.5"
      style={{
        background: `
          radial-gradient(circle at 15% 20%, rgba(255,245,200,.55) 0%, transparent 28%),
          radial-gradient(circle at 88% 12%, rgba(197,219,232,.35) 0%, transparent 26%),
          radial-gradient(circle at 70% 80%, rgba(168,148,255,.18) 0%, transparent 32%),
          linear-gradient(135deg,#ECE7F8 0%,#FFF9ED 55%,#F4EEF9 100%)
        `,
      }}
    >
      {/* MAC WINDOW */}

      <div
        className="
          relative
          flex
          h-[calc(100vh-20px)]
          overflow-hidden
          rounded-[28px]
          border border-white/70
          bg-[#FCFCFB]
          shadow-[0_20px_60px_rgba(60,45,110,.10)]
        "
      >
        {/* MAC CONTROLS */}

        <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>

        {/* =====================================================
            LEFT BRAND PANEL
        ===================================================== */}

        <section
          className="
            relative
            hidden
            w-[40%]
            overflow-hidden
            border-r border-[#EAE7EE]
            lg:flex
            lg:flex-col
            lg:justify-center
            lg:px-[4vw]
          "
          style={{
            background: `
              radial-gradient(circle at 20% 22%, rgba(255,244,189,.55) 0%, transparent 32%),
              radial-gradient(circle at 62% 78%, rgba(151,126,255,.20) 0%, transparent 34%),
              linear-gradient(145deg,#FFFDF8 0%,#FAF7F9 48%,#F4EFFB 100%)
            `,
          }}
        >
          {/* Ambient glow */}

          <div className="pointer-events-none absolute -bottom-28 left-[38%] h-[280px] w-[280px] rounded-full bg-[#8B7CFF]/10 blur-[75px]" />

          {/* Brand */}

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <h2 className="text-[34px] font-semibold leading-none tracking-[-0.055em] text-[#171717]">
                Aynam
              </h2>

              <span className="text-[27px] leading-none text-[#7565F5]">
                ✦
              </span>
            </div>

            <p className="mt-4 max-w-[250px] text-[15px] leading-[1.45] tracking-[-0.01em] text-[#858594]">
              Become someone you trust
              <br />
              every time you speak.
            </p>
          </div>

          {/* Quote */}

          <div className="absolute bottom-[8%] left-[4vw] flex items-start gap-3">
            <div className="mt-0.5 h-[38px] w-[2px] rounded-full bg-[#7867F6]" />

            <p className="text-[12px] italic leading-[18px] text-[#9695A5]">
              “A calmer mind.
              <br />
              A clearer you.”
            </p>
          </div>
        </section>

        {/* =====================================================
            RIGHT AUTH PANEL
        ===================================================== */}

        <section className="relative flex flex-1 items-center justify-center bg-[#FCFCFB] px-6 py-6 lg:px-10">
          
          {/* CREATE ACCOUNT */}

          <div className="absolute right-6 top-5 flex items-center gap-3 text-[11px] text-[#9999A4]">
            <span>New here?</span>

            <button
              type="button"
              className="
                rounded-full
                border border-[#E4E2E7]
                bg-white/70
                px-3.5 py-1.5
                font-medium
                text-[#303036]
                shadow-[0_2px_8px_rgba(0,0,0,.03)]
                transition
                hover:bg-white
              "
            >
              Create an account
            </button>
          </div>

          {/* MAIN CONTENT */}

          <div className="w-full max-w-[390px]">

            {/* HEADING */}

            <div className="mb-5">
              <h1 className="text-[29px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#171719]">
                Welcome to your
              </h1>

              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[29px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#7565F5]">
                  journey
                </span>

                <span className="text-[23px] leading-none text-[#7565F5]">
                  ✦
                </span>
              </div>

              <p className="mt-3 max-w-[285px] text-[13px] leading-[19px] text-[#9696A5]">
                Let's build a voice you trust,
                <br />
                one conversation at a time.
              </p>
            </div>

            {/* GOOGLE */}

            <button
              type="button"
              className="
                flex
                h-[44px]
                w-full
                items-center
                rounded-[12px]
                border border-[#E7E5E8]
                bg-white
                px-4
                text-[13px]
                font-medium
                text-[#26262A]
                shadow-[0_2px_7px_rgba(0,0,0,.025)]
                transition
                hover:bg-[#FAFAFA]
              "
            >
              <span className="w-7 text-left text-[16px] font-semibold">
                <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853] bg-clip-text text-transparent">
                  G
                </span>
              </span>

              <span className="flex-1 pr-7 text-center">
                Continue with Google
              </span>
            </button>

            {/* GITHUB */}

            <button
              type="button"
              className="
                mt-2
                flex
                h-[44px]
                w-full
                items-center
                rounded-[12px]
                border border-[#E7E5E8]
                bg-white
                px-4
                text-[13px]
                font-medium
                text-[#26262A]
                shadow-[0_2px_7px_rgba(0,0,0,.025)]
                transition
                hover:bg-[#FAFAFA]
              "
            >
              <span className="w-7 text-left text-[12px] font-semibold text-[#222]">
                GH
              </span>

              <span className="flex-1 pr-7 text-center">
                Continue with GitHub
              </span>
            </button>

            {/* DIVIDER */}

            <div className="my-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E6E4E8]" />

              <span className="text-[10px] text-[#9999A2]">
                or
              </span>

              <div className="h-px flex-1 bg-[#E6E4E8]" />
            </div>

            {/* EMAIL LABEL */}

            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="email"
                className="text-[12px] font-medium text-[#39393E]"
              >
                Email address
              </label>

              <button
                type="button"
                className="text-[11px] text-[#9292A0] underline underline-offset-2 transition hover:text-[#7565F5]"
              >
                Use magic link
              </button>
            </div>

            {/* EMAIL INPUT */}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#8D8D98]" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  h-[44px]
                  w-full
                  rounded-[12px]
                  border border-[#E4E3E7]
                  bg-white
                  pl-10 pr-4
                  text-[13px]
                  text-[#27272B]
                  outline-none
                  shadow-[0_2px_7px_rgba(0,0,0,.025)]
                  transition
                  placeholder:text-[#B2B2BA]
                  focus:border-[#B9B2F2]
                  focus:ring-4
                  focus:ring-[#7565F5]/[0.07]
                "
              />
            </div>

            {/* PASSWORD */}

            <div className="mt-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[12px] font-medium text-[#39393E]"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-[11px] text-[#9292A0] transition hover:text-[#7565F5]"
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="
                  h-[44px]
                  w-full
                  rounded-[12px]
                  border border-[#E4E3E7]
                  bg-white
                  px-4
                  text-[13px]
                  text-[#27272B]
                  outline-none
                  shadow-[0_2px_7px_rgba(0,0,0,.025)]
                  transition
                  placeholder:text-[#B2B2BA]
                  focus:border-[#B9B2F2]
                  focus:ring-4
                  focus:ring-[#7565F5]/[0.07]
                "
              />
            </div>

            {/* CONTINUE */}

            <button
              type="button"
              className="
                mt-2.5
                flex
                h-[46px]
                w-full
                items-center
                justify-center
                gap-2.5
                rounded-[12px]
                bg-[#292A2E]
                text-[13px]
                font-medium
                text-white
                shadow-[0_7px_20px_rgba(25,25,30,.12)]
                transition
                hover:bg-[#1F2023]
              "
            >
              Continue
              <ArrowRight className="h-[15px] w-[15px]" />
            </button>

            {/* TERMS */}

            <p className="mt-4 max-w-[290px] text-[10px] leading-[16px] text-[#9999A4]">
              By continuing, you agree to Aynam's{" "}
              <button className="underline underline-offset-2">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="underline underline-offset-2">
                Privacy Policy
              </button>
              .
            </p>
          </div>

          {/* BOTTOM PHILOSOPHY */}

          <div className="absolute bottom-4 right-6 flex items-center gap-2 text-[10px] italic text-[#9999A4]">
            <span>Practice</span>
            <span className="text-[#C2C0C8]">·</span>
            <span>Reflect</span>
            <span className="text-[#C2C0C8]">·</span>
            <span>Grow</span>
          </div>

          {/* AMBIENT ORB */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-14
              -right-10
              h-[140px]
              w-[140px]
              rounded-full
              opacity-50
              blur-[42px]
            "
            style={{
              background:
                "radial-gradient(circle, rgba(153,134,255,.42) 0%, rgba(255,223,142,.25) 45%, transparent 70%)",
            }}
          />
        </section>
      </div>
    </main>
  );
}