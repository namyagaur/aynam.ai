"use client";

import { useState } from "react";
import RollingWheel from "./RollingWheel";
import {
  publicSpeakingTopics,
  conversationTopics,
  storytellingTopics,
  socialTopics,
} from "../data/topics";
import DurationKnob from "@/components/practice/DurationKnob";
import ModeSelector from "./ModeSelector";

type Mode = "public-speaking" | "conversation" | "storytelling" | "social";

type Props = {
  selectedMode?: Mode;
};

export default function TopicGenerator({
  selectedMode = "public-speaking",
}: Props) {
  const getTopics = () => {
    switch (selectedMode) {
      case "conversation":
        return conversationTopics;

      case "storytelling":
        return storytellingTopics;

      case "social":
        return socialTopics;

      default:
        return publicSpeakingTopics;
    }
  };

  const topics = getTopics();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [step, setStep] = useState<"topic" | "setup">("topic");
  const [duration, setDuration] = useState(5);

  const handleRoll = () => {
    if (rolling) return;

    setRolling(true);
    setHasRolled(true);
    const totalSteps = 12 + Math.floor(Math.random() * 5);

    let step = 0;

    const roll = () => {
      step++;

      setCurrentIndex((prev) => (prev + 1) % topics.length);

      if (step < totalSteps) {
        const speed = Math.min(35 + step * 5, 110);

        setTimeout(roll, speed);
      } else {
        setRolling(false);
      }
    };

    roll();
  };

  return (
  <section className="mt-2 flex flex-col items-center">

    {step === "topic" && (
      <>
      <div className="-mt-2 mb-8">
  <ModeSelector />
</div>
        <RollingWheel
          topics={topics}
          currentIndex={currentIndex}
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleRoll}
            disabled={rolling}
            className="
              rounded-full
              border
              border-zinc-300
              bg-white
              px-6
              py-3
              text-sm
              font-medium
            "
          >
            {rolling
              ? "Rolling..."
              : hasRolled
              ? "🎲 Roll Again"
              : "🎲 Roll Topic"}
          </button>

          {hasRolled && !rolling && (
            <button
              onClick={() => setStep("setup")}
              className="
                rounded-full
                bg-[#7C6CF8]
                px-6
                py-3
                text-sm
                font-medium
                text-white
              "
            >
              Continue →
            </button>
          )}
        </div>
      </>
    )}

    {step === "setup" && (
      <div className="mt-12 flex flex-col items-center">

  <p className="text-sm text-zinc-500">
    Today's Topic
  </p>

  <h2 className="mt-2 text-4xl font-semibold text-[#7C6CF8]">
    {topics[currentIndex]}
  </h2>

  <div className="mt-16">
    <DurationKnob value={duration} />
  </div>

</div>
    )}

  </section>
);
}
