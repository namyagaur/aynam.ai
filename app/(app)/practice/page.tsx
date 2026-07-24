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
    <main className="min-h-screen bg-[#101726] p-10 text-white">

      <h1 className="text-4xl font-bold">
        Practice
      </h1>

      <p className="mt-2 text-white/60">
        Configure your practice session.
      </p>

      {/* Topic */}

      <div className="mt-10">

        <label className="mb-2 block text-lg">
          Topic
        </label>

        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-[#1B2233] p-4"
        >
          <option>Tell me about yourself</option>
          <option>Mock Interview</option>
          <option>Public Speaking</option>
          <option>Debate</option>
          <option>Random Topic</option>
        </select>

      </div>

      {/* Duration */}

      <div className="mt-8">

        <label className="mb-3 block text-lg">
          Duration
        </label>

        <div className="flex gap-4">

          {[5, 10, 15, 20].map((time) => (

            <button
              key={time}
              onClick={() => setDuration(time)}
              className={`rounded-lg px-6 py-3 transition ${
                duration === time
                  ? "bg-sky-400 text-black"
                  : "bg-[#1B2233]"
              }`}
            >
              {time} min
            </button>

          ))}

        </div>

      </div>

      {/* Difficulty */}

      <div className="mt-8">

        <label className="mb-3 block text-lg">
          Difficulty
        </label>

        <div className="flex gap-4">

          {["Easy", "Medium", "Hard"].map((level) => (

            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`rounded-lg px-6 py-3 transition ${
                difficulty === level
                  ? "bg-sky-400 text-black"
                  : "bg-[#1B2233]"
              }`}
            >
              {level}
            </button>

          ))}

        </div>

      </div>

      {/* Start */}

      <button
        onClick={handleStartSession}
        className="mt-12 rounded-lg bg-sky-400 px-8 py-4 text-lg font-semibold text-black"
      >
        Start Session
      </button>

    </main>
  );
}