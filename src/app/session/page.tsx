"use client";

import { useRouter } from "next/navigation";

export default function SessionPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <p className="uppercase tracking-[0.3em] text-gray-400 text-sm">
              Recording Session
            </p>

            <h1 className="mt-3 text-5xl font-extralight tracking-tight">
              Speak Naturally.
            </h1>
          </div>

          <div className="text-right">
            <p className="text-gray-400 text-sm">
              Remaining Time
            </p>

            <h2 className="text-4xl font-extralight">
              05:00
            </h2>
          </div>

        </div>

        {/* Topic */}
        <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm">

          <p className="text-sm text-gray-400">
            Topic
          </p>

          <h2 className="mt-3 text-2xl font-light">
            Tell a story about a difficult decision.
          </h2>

        </div>

        {/* Recording Section */}
        <div className="mt-8 bg-white rounded-3xl p-10 shadow-sm text-center">

          <div className="w-28 h-28 mx-auto rounded-full bg-[#F7F4FF] flex items-center justify-center text-5xl">
            🎤
          </div>

          <h3 className="mt-6 text-2xl font-light">
            Listening...
          </h3>

          <p className="mt-2 text-gray-500">
            Speak naturally. We're analyzing your communication.
          </p>

        </div>

        {/* Live Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">

          <div className="bg-white rounded-3xl p-6">
            <p className="text-gray-400 text-sm">
              Fillers
            </p>

            <h3 className="mt-2 text-4xl font-light">
              0
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-6">
            <p className="text-gray-400 text-sm">
              Words
            </p>

            <h3 className="mt-2 text-4xl font-light">
              0
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-6">
            <p className="text-gray-400 text-sm">
              Pace
            </p>

            <h3 className="mt-2 text-4xl font-light">
              --
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-6">
            <p className="text-gray-400 text-sm">
              Confidence
            </p>

            <h3 className="mt-2 text-4xl font-light">
              --
            </h3>
          </div>

        </div>

        {/* Transcript */}
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm">

          <p className="text-sm text-gray-400">
            Live Transcript
          </p>

          <div className="mt-5 min-h-[180px] rounded-2xl bg-[#FAFAFA] p-6">

            <p className="text-gray-500">
              Waiting for speech...
            </p>

          </div>

        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between mt-10">

          <button
            className="px-6 py-3 rounded-2xl border border-gray-200"
          >
            Pause Session
          </button>

          <button
            onClick={() => router.push("/analysis")}
            className="px-8 py-4 rounded-2xl bg-[#A78BFA] text-white font-medium"
          >
            End Session →
          </button>

        </div>

      </div>
    </main>
  );
}