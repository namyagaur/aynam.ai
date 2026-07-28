"use client";

import DurationKnob from "./DurationKnob";

type Props = {
  topic: string;
  duration: number;
  setDuration: (n: number) => void;
  onBack: () => void;
};

export default function PracticeSetup({
  topic,
  duration,
  setDuration,
  onBack,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center pt-4">

      <button
        onClick={onBack}
        className="mb-10 self-start text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Back
      </button>

<h1 className="max-w-xl text-center text-[30px] font-semibold leading-snug text-[#7C6CF8]">
                {topic}
      </h1>

      <div className="mt-14">
        <DurationKnob
    value={duration}
    onChange={setDuration}
/>
      </div>

    </div>
  );
}