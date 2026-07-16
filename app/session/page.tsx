"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read values passed from Practice page
  const topic = searchParams.get("topic") || "Unknown Topic";
  const duration = searchParams.get("duration") || "10";
  const difficulty = searchParams.get("difficulty") || "Medium";

  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  function handleRecording() {
    setIsRecording(!isRecording);
  }

  function handleEndSession() {
    router.push(
  `/feedback?topic=${encodeURIComponent(topic)}&duration=${duration}&difficulty=${difficulty}&time=${seconds}`
);
  }

  return (
    <main className="min-h-screen bg-[#101726] p-10 text-white">

      <h1 className="text-4xl font-bold">
        Speaking Session
      </h1>

      <div className="mt-8 space-y-3">

        <p>
          <strong>Topic:</strong> {topic}
        </p>

        <p>
          <strong>Duration:</strong> {duration} min
        </p>

        <p>
          <strong>Difficulty:</strong> {difficulty}
        </p>

      </div>

      {/* Timer */}

      <div className="mt-10">

        <h2 className="text-5xl font-bold">

          {String(minutes).padStart(2, "0")}:
          {String(remainingSeconds).padStart(2, "0")}

        </h2>

      </div>

      {/* Recording */}

      <button
        onClick={handleRecording}
        className="mt-10 rounded-lg bg-sky-400 px-8 py-4 font-semibold text-black"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Transcript */}

      <div className="mt-10 rounded-lg border border-white/10 bg-[#1B2233] p-6">

        <h2 className="text-xl font-semibold">
          Transcript
        </h2>

        <p className="mt-4 text-white/60">

          {isRecording
            ? "Listening..."
            : "Press Start Recording to begin speaking."}

        </p>

      </div>

      <button
        onClick={handleEndSession}
        className="mt-10 rounded-lg bg-red-500 px-8 py-4 font-semibold"
      >
        End Session
      </button>

    </main>
  );
}