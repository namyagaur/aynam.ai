"use client";
import CommunicationModes from "@/components/practice/CommunicationModes";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PracticePage() {
  const router = useRouter();

  const [topic, setTopic] = useState("Tell me about yourself");
  const [duration, setDuration] = useState(10);
  const [difficulty, setDifficulty] = useState("Medium");

  function handleStartSession() {
    console.log({
      topic,
      duration,
      difficulty,
    });

   router.push(
  `/session?topic=${encodeURIComponent(topic)}&duration=${duration}&difficulty=${difficulty}`
);
  }

 return (
  <main className="h-full overflow-hidden px-10 py-8">

    {/* Header */}

    <header className="mb-8">

      <p className="text-[15px] text-[#7A7783]">
        Practice
      </p>

      <h1 className="mt-1 font-serif text-[62px] leading-[62px] tracking-[-2px] text-[#22212A]">
        Practice
      </h1>

      <p className="mt-3 max-w-[480px] text-[17px] leading-8 text-[#6E6C74]">
        Choose a communication mode and let AI generate
        fresh topics for you to speak on.
      </p>

    </header>

    {/* Workspace */}

    <div className="flex gap-6">

      {/* Left */}

      <aside className="w-[280px] shrink-0">

        <CommunicationModes />

      </aside>

      {/* Right */}

      <section className="flex-1 rounded-[34px] border border-[#ECE7E1] bg-white p-8">

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-[34px] font-semibold text-[#22212A]">
              AI Generated Topics
            </h2>

            <p className="mt-2 text-[15px] text-[#75737B]">
              Fresh topics generated just for you.
            </p>

          </div>

          <button
            className="
              rounded-2xl
              border
              border-[#EAE6E0]
              bg-[#FCFBFA]
              px-6
              py-3
              text-[15px]
              transition
              hover:bg-white
            "
          >
            ✨ Generate New Topics
          </button>

        </div>

        {/* Carousel Placeholder */}

        <div className="mt-8 h-[300px] rounded-[30px] bg-[#FBFAF8]" />

        {/* Bottom Panel Placeholder */}

        <div className="mt-6 h-[210px] rounded-[30px] bg-[#FCFBFA]" />

      </section>

    </div>

  </main>
);
}