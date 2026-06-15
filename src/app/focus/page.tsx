"use client";

import { useEffect, useState } from "react";

export default function FocusPage() {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const savedTopic = localStorage.getItem("topic") || "";
    const savedDuration = localStorage.getItem("duration") || "";

    setTopic(savedTopic);
    setDuration(savedDuration);
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">

        <p className="text-center text-gray-400 uppercase tracking-[0.3em]">
          Preparation
        </p>

        <h1 className="text-center text-5xl font-extralight mt-6">
          Take a moment.
        </h1>

        <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm">

          <p className="text-sm text-gray-400">
            Topic
          </p>

          <h2 className="mt-3 text-2xl font-light">
            {topic}
          </h2>

          <p className="mt-8 text-sm text-gray-400">
            Duration
          </p>

          <h3 className="mt-2 text-xl">
            {duration} minutes
          </h3>

        </div>

      </div>
    </main>
  );
}