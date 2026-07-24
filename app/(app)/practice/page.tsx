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
<main className="h-full overflow-y-auto bg-[#FFFDF9] px-8 pt-6 pb-6">
    {/* Header */}

    <header className="mb-5">

  <span className="text-[14px] text-[#8B8792]">
    Practice
  </span>

  <h1 className="mt-1 font-serif text-[52px] leading-[52px] tracking-[-1.5px] text-[#23222A]">
    Practice
  </h1>

  <p className="mt-2 max-w-[430px] text-[15px] leading-7 text-[#706D77]">
    Choose a communication mode and let AI generate
    fresh topics for your next speaking session.
  </p>

</header>

    {/* Workspace */}

<div className="flex items-start gap-5">
      {/* Left */}

      <aside className="w-[255px] shrink-0">

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