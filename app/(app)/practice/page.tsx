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
    <main className="flex h-full flex-col p-12">

  {/* Header */}

  <div className="mb-6">

  <span className="text-[15px] font-medium text-[#76747D]">
    Practice
  </span>

  <h1
  className="
    mt-1
    font-serif
    text-[58px]
    leading-[58px]
    tracking-[-2px]
    text-[#232228]
  "
>
    Practice
  </h1>

  <p
    className="
      mt-2
      max-w-[520px]
      text-[16px]
      leading-8
      text-[#6C6A73]
    "
  >
    Choose a communication mode and let AI generate fresh
    topics for you to speak on.
  </p>

</div>

  {/* Categories */}

 <section className="mt-4 flex gap-7 items-start">

  {/* LEFT COLUMN */}

  <div className="w-[320px] shrink-0">

    <h2 className="mb-5 text-[18px] font-semibold text-[#2A2A2A]">
      Choose your practice mode
    </h2>

    <CommunicationModes />

  </div>

  {/* RIGHT COLUMN */}

  <div className="flex-1">

    <div className="rounded-[34px] border border-[#ECE8E2] bg-white p-8">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-[32px] font-semibold">
            AI Generated Topics
          </h2>

          <p className="mt-2 text-[#77767F]">
            Fresh topics generated just for you.
          </p>

        </div>

        <button
          className="rounded-2xl border border-[#ECE8E2] px-6 py-3"
        >
          Generate New Topics
        </button>

      </div>

      <div className="mt-10 h-[260px] rounded-3xl bg-[#FAF9F7]" />

    </div>

  </div>

</section>

  {/* AI Topics */}

  <section className="mt-12">

    <div className="flex items-center justify-between">

      <h2 className="text-lg font-medium">
        AI Generated Topics
      </h2>

      <button>
        Refresh
      </button>

    </div>

    <div className="mt-5">

      {/* horizontal carousel */}

    </div>

  </section>

  {/* Bottom Controls */}

  <section className="mt-auto flex items-center justify-between pt-12">

    <div>

      {/* duration */}

    </div>

    <div>

      {/* transcript */}

    </div>

    <div>

      {/* start */}

    </div>

  </section>

</main>
  );
}