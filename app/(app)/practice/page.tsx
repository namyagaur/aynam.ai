"use client";

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

  <div>
    <p className="text-sm text-neutral-500">
      Practice
    </p>

    <h1 className="mt-2 text-5xl font-semibold tracking-tight text-[#1E1E24]">
      Let's practice.
    </h1>

    <p className="mt-3 max-w-2xl text-lg text-neutral-500">
      Choose a communication mode and let AI generate fresh speaking
      topics tailored just for you.
    </p>
  </div>

  {/* Categories */}

  <section className="mt-12">

    <h2 className="mb-5 text-lg font-medium">
      Communication Mode
    </h2>

    <div className="flex gap-3">

      {/* cards will come here */}

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