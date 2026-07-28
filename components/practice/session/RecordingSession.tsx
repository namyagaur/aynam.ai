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
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);

  // Reset whenever a new duration is passed in (new session)
  useEffect(() => {
    setSecondsLeft(duration * 60);
  }, [duration]);

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="mx-auto flex h-screen w-full max-w-5xl flex-col items-center justify-center px-10 py-4">

      {/* Back */}
      <button
        onClick={onEnd}
        className="mb-3 self-start text-[14px] text-zinc-500 transition hover:text-zinc-900"
      >
        ← End Session
      </button>

      {/* Topic */}
      <h1 className="max-w-3xl text-center text-[26px] font-semibold leading-tight tracking-tight text-[#6B63F6]">
        {topic}
      </h1>

      {/* Subtitle */}
      <p className="mt-1.5 text-[15px] text-zinc-500">
        Speak naturally. There is no right or wrong answer.
      </p>

      {/* Duration Pill */}
      <div className="mt-3 rounded-full border border-[#ECE9FF] bg-[#F7F6FF] px-4 py-1.5 text-[13px] font-medium text-[#6B63F6]">
        {duration} min session
      </div>

      {/* Timer */}
      <div
        className="mt-5 flex h-[330px] w-[330px] items-center justify-center rounded-full p-[3px] transition-[background] duration-500"
        style={{
          background: `conic-gradient(#7C6CF8 ${progressDeg}deg, #E5E7EB ${progressDeg}deg)`,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-zinc-200 bg-white shadow-[0_30px_80px_rgba(0,0,0,.05)]">
          <div className="text-center">
            <div className="text-[56px] font-semibold text-zinc-900">
              {formattedTime}
            </div>

            <div className="mt-1 text-sm text-zinc-400">
              of {String(duration).padStart(2, "0")}:00
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-red-500">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Recording...
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Card */}
      <div className="mt-5 w-full rounded-[24px] border border-zinc-100 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,.04)]">

        <div className="mb-5 text-sm font-semibold text-zinc-700">
          Live Transcript
        </div>

        <div className="leading-8 text-zinc-300">
          Your speech will appear here...
        </div>

      </div>

      {/* Bottom Buttons */}
      <div className="mt-5 flex items-center gap-4">

        <button
          className="
          h-14
          w-44
          rounded-full
          border
          border-zinc-200
          bg-white
          text-lg
          font-medium
          shadow-sm
          transition
          hover:bg-zinc-50
        "
        >
          Pause
        </button>

        <button
          className="
          h-14
          w-60
          rounded-full
          bg-[#6B63F6]
          text-lg
          font-medium
          text-white
          shadow-[0_20px_40px_rgba(107,99,246,.25)]
          transition
          hover:scale-[1.01]
        "
        >
          Finish Session →
        </button>

      </div>

      <p className="mt-2 text-xs text-zinc-400">
        Your recording will be analyzed after finishing.
      </p>

    </div>
  );
}