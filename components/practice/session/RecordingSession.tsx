"use client";

import { useState, useEffect } from "react";

type Props = {
  topic: string;
  duration: number;
  onEnd: () => void;
};

export default function RecordingSession({
  topic,
  duration,
  onEnd,
}: Props) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => duration * 60);

  // Only ticks once the user presses Start
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const formattedTime = `${String(mm).padStart(2, "0")}:${String(
    ss
  ).padStart(2, "0")}`;

  const totalSeconds = duration * 60;
  const elapsed = totalSeconds - secondsLeft;
  const progressDeg =
    totalSeconds > 0 ? (elapsed / totalSeconds) * 360 : 0;

  return (
<div className="flex w-full min-h-0 overflow-hidden">
      {/* Recording Panel */}
<div className="flex flex-1 flex-col items-center px-10 pt-2 pb-4 transition-all duration-300 ease-out">   
       <div className="flex w-full max-w-3xl items-center justify-between mb-6">
          <button
            onClick={onEnd}
            className="text-[13px] text-zinc-500 transition hover:text-zinc-900"
          >
            ← End Session
          </button>

          <button
            onClick={() => setShowTranscript((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
              showTranscript
                ? "border-[#ECE9FF] bg-[#F7F5FF] text-[#6759E8]"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16" />
            </svg>
            Live Transcript
            <span className="ml-0.5 text-[11px] text-zinc-400">⌘T</span>
          </button>
        </div>

        {/* Topic */}
        <h1 className="mt-0 max-w-xl text-center text-[22px] font-semibold leading-tight tracking-tight text-[#6B63F6]">
          {topic}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-[13px] text-zinc-500">
          Speak naturally. There is no right or wrong answer.
        </p>

        {/* Duration Pill */}
        <div className="mt-4 rounded-full border border-[#ECE9FF] bg-[#F7F6FF] px-3.5 py-1 text-[12px] font-medium text-[#6B63F6]">
          {duration} min session
        </div>

        {/* Timer */}
        <div
          className="relative mt-5 aspect-square w-[160px] shrink-0 rounded-full"
          style={{
            background: `conic-gradient(#7C6CF8 ${progressDeg}deg, #E5E7EB ${progressDeg}deg)`,
          }}
        >
          <div className="absolute inset-[3px] flex flex-col items-center justify-center rounded-full border border-dashed border-zinc-200 bg-white shadow-[0_12px_30px_rgba(0,0,0,.04)]">
            <div className="text-center">
              <div className="text-[30px] font-semibold text-zinc-900">
                {formattedTime}
              </div>

              <div className="mt-0.5 text-[11px] text-zinc-400">
                of {String(duration).padStart(2, "0")}:00
              </div>

              <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-red-500">
                <span className={`h-1.5 w-1.5 rounded-full bg-red-500 ${started ? "" : "opacity-40"}`} />
                {started ? "Recording..." : "Ready"}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="mt-6 flex items-center gap-3">
          {!started ? (
            <button
              onClick={() => setStarted(true)}
              className="
              h-10
              w-32
              rounded-full
              bg-[#6B63F6]
              text-[14px]
              font-medium
              text-white
              shadow-[0_10px_20px_rgba(107,99,246,.2)]
              transition
              hover:scale-[1.01]
            "
            >
              ▶ Start
            </button>
          ) : (
            <>
              <button
                className="
                h-10
                w-32
                rounded-full
                border
                border-zinc-200
                bg-white
                text-[14px]
                font-medium
                text-[#6759E8]
                shadow-sm
                transition
                hover:bg-zinc-50
              "
              >
                ⏸ Pause
              </button>

              <button
                className="
                h-10
                w-44
                rounded-full
                bg-[#6B63F6]
                text-[14px]
                font-medium
                text-white
                shadow-[0_10px_20px_rgba(107,99,246,.2)]
                transition
                hover:scale-[1.01]
              "
              >
                ▢ Finish Session
              </button>
            </>
          )}
        </div>

        <p className="mt-2 text-[11px] text-zinc-400">
          Your recording will be analyzed after finishing.
        </p>
      </div>

      {/* Live Transcript Sidebar */}
      <div
        className={`h-full shrink-0 overflow-hidden border-l border-zinc-100/70 transition-all duration-300 ease-out ${
          showTranscript ? "w-[320px]" : "w-0"
        }`}
      >
        <div className="flex h-full w-full flex-col px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[14px] font-semibold text-zinc-800">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C6CF8" strokeWidth="2">
                <path d="M4 12h2l2-7 3 14 2-9 2 4h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Live Transcript
            </div>

            <button
              onClick={() => setShowTranscript(false)}
              className="text-zinc-400 transition hover:text-zinc-700"
            >
              ✕
            </button>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Listening...
          </div>

          <div className="mt-3 flex-1 space-y-3 overflow-y-auto text-[13px] leading-6">
            <div className="text-zinc-300">Your speech will appear here...</div>
          </div>

          {/* Waveform placeholder */}
          <div className="mt-2 flex h-6 items-end gap-[2px] opacity-50">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-[#7C6CF8]"
                style={{ height: `${4 + ((i * 7) % 16)}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
 
}
