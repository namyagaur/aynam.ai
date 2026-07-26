"use client";

import CommunicationModes from "@/components/practice/CommunicationModes";
import TopicsCarousel from "@/components/practice/topics/TopicsCarousel";

export default function PracticePage() {
  return (
    <main className="h-full bg-[#FFFCF8] px-10 py-8">

      {/* Header */}

      <header className="mb-10">
        <h1 className="font-serif text-[40px] leading-none tracking-[-1.5px] text-[#24222C]">
          Choose what you'd like to practice
        </h1>

        <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[#77747F]">
          Build confidence one conversation at a time with guided speaking
          sessions tailored to your goals.
        </p>
      </header>

      {/* Content */}

      <div className="grid grid-cols-[300px_1fr] gap-12">

        {/* Left */}

        <section>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A7A3AF]">
              01
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#26242D]">
              Communication Mode
            </h2>

            <p className="mt-1 text-sm text-[#7A7781]">
              Choose how you'd like to practice.
            </p>
          </div>

          <CommunicationModes />

        </section>

        {/* Right */}

        <section className="flex flex-col">

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A7A3AF]">
              02
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#26242D]">
              Choose a Topic
            </h2>

            <p className="mt-1 text-sm text-[#7A7781]">
              We'll recommend prompts based on your selected mode.
            </p>
          </div>

          <TopicsCarousel />

          <div className="mt-10 flex justify-end">
            <button
              disabled
              className="h-12 rounded-2xl bg-[#E8E5EF] px-8 text-[15px] font-semibold text-[#9B98A4]"
            >
              Continue →
            </button>
          </div>

        </section>

      </div>

    </main>
  );
}