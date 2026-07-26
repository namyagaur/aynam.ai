"use client";

import CommunicationModes from "@/components/practice/CommunicationModes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TopicsCarousel from "@/components/practice/topics/TopicsCarousel";

export default function PracticePage() {
  const router = useRouter();

  const [topic, setTopic] = useState("Tell me about yourself");



  return (
<main className="h-full overflow-hidden bg-[#FFFCF8]">
      {/* ================= HEADER ================= */}

      <div className="mb-8">

    <h1 className="text-[38px] font-serif tracking-[-1px] text-[#24222C]">
        Choose what you'd like to practice
    </h1>

    <p className="mt-3 max-w-[560px] text-[15px] leading-7 text-[#77747F]">
        Select a communication mode and let Aynam recommend
        speaking topics tailored for your practice.
    </p>

</div>

      {/* ================= BODY ================= */}

<div className="grid h-[calc(100%-92px)] grid-cols-[330px_780px] gap-8">        {/* LEFT */}

        <aside className="overflow-hidden">

          <CommunicationModes />

        </aside>

        {/* RIGHT */}

        <section className="flex flex-col rounded-[26px] border border-[#ECE7E2] bg-white p-5">

          {/* Header */}

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-[18px] font-semibold text-[#26242D]">
                Choose a prompt that feels interesting today.
              </h2>

              <p className="mt-1 text-[13px] text-[#7A7781]">
                Fresh AI generated practice prompts.
              </p>

            </div>

            

          </div>

          {/* ================= CAROUSEL ================= */}

<div className="mt-3">
  <TopicsCarousel />
</div>
         
        </section>

      </div>

    </main>
  );
}