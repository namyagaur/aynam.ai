"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const topics = [
  "Tell a story about a difficult decision.",
  "Describe your dream life.",
  "What does success mean to you?",
  "Should AI replace teachers?",
  "Convince someone to learn coding.",
  "Describe a moment that changed you.",
  "If money didn't matter, what would you do?",
];

export default function PreparePage() {
  const router = useRouter();
  const [duration, setDuration] = useState(5);
  const [topic, setTopic] = useState("");

  function generateTopic() {
    const randomIndex = Math.floor(Math.random() * topics.length);
    setTopic(topics[randomIndex]);
  }
  function startSession() {
  localStorage.setItem("duration", duration.toString());
  localStorage.setItem("topic", topic);

  router.push("/focus");
}
  return (
    <main className="min-h-screen bg-[#FFFDF8] px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extralight text-center">
          Practice Session
        </h1>

        <p className="text-center text-gray-500 mt-4">
          Choose your speaking duration
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-10">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((minute) => (
            <button
              key={minute}
              onClick={() => setDuration(minute)}
              className={`px-4 py-2 rounded-full transition ${
                duration === minute
                  ? "bg-purple-400 text-white"
                  : "bg-white border"
              }`}
            >
              {minute}m
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={generateTopic}
            className="px-6 py-3 rounded-full bg-black text-white"
          >
            Generate Topic
          </button>
        </div>

        {topic && (
          <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm">
            <p className="text-gray-500 text-sm">
              Your Topic
            </p>

            <h2 className="mt-3 text-2xl font-light">
              {topic}
            </h2>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
  onClick={startSession}
  className="px-8 py-4 rounded-full bg-[#A78BFA] text-white"
>
  Start Speaking
</button>
        </div>
      </div>
    </main>
  );
}