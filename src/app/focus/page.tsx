"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function FocusPage() {
  const router = useRouter();
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
          <div className="mt-8 border-t pt-8">
            <p className="text-sm text-gray-400">
              Suggested Structure
            </p>

            <ul className="mt-4 space-y-2 text-gray-700">
              <li>1. Set the context</li>
              <li>2. Explain the situation</li>
              <li>3. Describe the challenge</li>
              <li>4. Share the outcome</li>
              <li>5. End with your lesson</li>
            </ul>
          </div>

          <div className="mt-8 rounded-2xl bg-[#F7F4FF] p-5">
            <p className="text-sm text-gray-500">
              Focus Tip
            </p>

            <p className="mt-2 text-gray-700">
              Don't try to sound perfect. Focus on being clear.
            </p>
          </div>
          <button
            onClick={() => router.push("/session")}
            className="mt-8 w-full rounded-2xl bg-[#A78BFA] px-6 py-4 text-white font-medium transition hover:opacity-90"
          >
            Begin Session →
          </button>
        </div>


      </div>
    </main>
  );
}