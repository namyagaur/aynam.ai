"use client";

import CommunicationModes from "@/components/practice/CommunicationModes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TopicsCarousel from "@/components/practice/topics/TopicsCarousel";

export default function PracticePage() {
  const router = useRouter();

  const [topic, setTopic] = useState("Tell me about yourself");
  const [duration, setDuration] = useState(10);
  const [difficulty, setDifficulty] = useState("Medium");

  function handleStartSession() {
    router.push(
      `/session?topic=${encodeURIComponent(
        topic
      )}&duration=${duration}&difficulty=${difficulty}`
    );
  }

  return (
    <main className="h-full overflow-hidden bg-[#FFFCF8] px-6 py-5">

      {/* ================= HEADER ================= */}

      <div className="mb-5">
        <h1 className="mt-1 font-serif text-[48px] leading-[50px] tracking-[-1.5px] text-[#24222C]">
          Lets Practice
        </h1>

      </div>

      {/* ================= BODY ================= */}

      <div className="grid h-[calc(100%-120px)] grid-cols-[250px_1fr] gap-5">

        {/* LEFT */}

        <aside className="overflow-hidden">

          <CommunicationModes />

        </aside>

        {/* RIGHT */}

        <section className="flex flex-col rounded-[30px] border border-[#ECE7E2] bg-white p-6">

          {/* Header */}

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-[20px] font-semibold text-[#26242D]">
                AI Generated Topics
              </h2>

              <p className="mt-1 text-[13px] text-[#7A7781]">
                Fresh AI generated practice prompts.
              </p>

            </div>

            <button
              className="
                rounded-2xl
                border
                border-[#ECE7E1]
                bg-[#FBFAF8]
                px-5
                py-2.5
                text-[14px]
                font-medium
                transition
                hover:bg-white
              "
            >
              ✨ Generate New
            </button>

          </div>

          {/* ================= CAROUSEL ================= */}

<div className="mt-5 flex-1">
  <TopicsCarousel />
</div>
          {/* ================= CONTROLS ================= */}

          <div className="mt-5 grid h-[150px] grid-cols-4 rounded-[28px] border border-[#F1EEEA] bg-[#FCFBFA]">

            {/* Duration */}

            <div className="flex items-center justify-center border-r border-[#F1EEEA]">

              <span className="text-[#A6A2AA]">
                Duration Knob
              </span>

            </div>

            {/* Difficulty */}

            <div className="flex items-center justify-center border-r border-[#F1EEEA]">

              <span className="text-[#A6A2AA]">
                Difficulty
              </span>

            </div>

            {/* Transcript */}

            <div className="flex items-center justify-center border-r border-[#F1EEEA]">

              <span className="text-[#A6A2AA]">
                Transcript
              </span>

            </div>

            {/* CTA */}

            <div className="flex items-center justify-center">

              <button
                onClick={handleStartSession}
                className="
                  rounded-2xl
                  bg-[#4E5AE8]
                  px-8
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Start Session
              </button>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}