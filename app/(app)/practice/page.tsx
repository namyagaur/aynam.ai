"use client";

import CommunicationModes from "@/components/practice/CommunicationModes";
import TopicsCarousel from "@/components/practice/topics/TopicsCarousel";

export default function PracticePage() {
  return (
    <main className="h-full overflow-y-auto bg-[#FFFCF8] px-10 py-8">

      {/* ================= HEADER ================= */}

      <header className="mb-10">

        <h1 className="font-serif text-[42px] leading-none tracking-[-1.5px] text-[#24222C]">
          Choose what you'd like to practice
        </h1>

        <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[#77747F]">
          Select a communication mode and let Aynam recommend
          speaking topics tailored specifically for your practice.
        </p>

      </header>

      {/* ================= CONTENT ================= */}

      <div className="grid grid-cols-[320px_1fr] gap-8 items-start">

        {/* ================= LEFT ================= */}

        <aside
          className="
            rounded-[30px]
            border
            border-[#ECE8E2]
            bg-white
            p-5
            shadow-[0_12px_40px_rgba(40,35,80,.04)]
          "
        >

          <div className="mb-6">

            <h2 className="text-[18px] font-semibold text-[#24222C]">
              Communication Modes
            </h2>

            <p className="mt-1 text-[13px] text-[#7E7B85]">
              Choose how you'd like to practice.
            </p>

          </div>

          <CommunicationModes />

        </aside>

        {/* ================= RIGHT ================= */}

        <section
          className="
            flex
            min-h-[640px]
            flex-col
            rounded-[30px]
            border
            border-[#ECE8E2]
            bg-white
            p-6
            shadow-[0_12px_40px_rgba(40,35,80,.04)]
          "
        >

          {/* Header */}

          <div>

            <h2 className="text-[20px] font-semibold text-[#26242D]">
              Today's AI Suggestions ✨
            </h2>

            <p className="mt-2 text-[14px] text-[#7A7781]">
              Choose a prompt that feels interesting today.
            </p>

          </div>

          {/* Carousel */}

          <div className="mt-8">

            <TopicsCarousel />

          </div>

          {/* Bottom CTA Placeholder */}

          <div className="mt-auto pt-10">

            <button
              disabled
              className="
                h-12
                w-full
                rounded-2xl
                bg-[#E8E5EF]
                text-[15px]
                font-semibold
                text-[#9B98A4]
              "
            >
              Select a topic to continue
            </button>

          </div>

        </section>

      </div>

    </main>
  );
}