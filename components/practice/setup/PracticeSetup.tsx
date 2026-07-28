// PracticeSetup.tsx
"use client";

import DurationKnob from "./DurationKnob";

type Props = {
  topic: string;
  duration: number;
  setDuration: (n: number) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function PracticeSetup({ topic, duration, setDuration, onBack,onContinue, }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center pt-2">
      <button
        onClick={onBack}
        className="mb-6 self-start text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        ← Back
      </button>

      <h1 className="max-w-lg text-center text-[28px] font-semibold leading-snug tracking-tight text-[#7C6CF8]">
        {topic}
      </h1>
      <p
  className="
    mt-2
    text-lg
    text-zinc-500
  "
>
  Take your time. You've got this.
</p>

<div className="mt-4 flex flex-col items-center">
  <div
    className="
      mb-5
      rounded-full
      border
      border-[#ECE9FF]
      bg-[#F7F5FF]
      px-4
      py-2
      shadow-sm
    "
  >
    <span
      className="
        text-sm
        font-medium
        text-[#6759E8]
      "
    >
      {duration} min selected
    </span>
  </div>

  <DurationKnob
    value={duration}
    onChange={setDuration}
  />

</div>
<button
  className="
    mt-6
    h-12
    w-[260px]
    rounded-full
    bg-gradient-to-r
    from-[#7569F7]
    to-[#6557EA]
    text-white
    text-lg
    font-medium
    shadow-[0_12px_30px_rgba(103,89,232,.28)]
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-[0_18px_40px_rgba(103,89,232,.34)]
    active:translate-y-0
    
  "
  onClick={onContinue}
>
  Continue →
</button>
<div
  className="
    mt-3
    flex
    items-center
    gap-2
    text-sm
    text-zinc-400
  "
>
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2"
    />

    <path d="M8 11V8a4 4 0 118 0v3"/>
  </svg>

  <span>
    You can change duration later
  </span>
</div>
    </div>
  );
}