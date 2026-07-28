"use client";

import { useState } from "react";
import RollingWheel from "./RollingWheel";
import {
  publicSpeakingTopics,
  conversationTopics,
  storytellingTopics,
  socialTopics,
} from "../data/topics";

type Mode =
  | "public-speaking"
  | "conversation"
  | "storytelling"
  | "social";

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

  const handleRoll = () => {
    if (rolling) return;

    setRolling(true);

    const totalSteps = 22 + Math.floor(Math.random() * 10);

    let step = 0;

    const roll = () => {
      step++;

      setCurrentIndex((prev) => (prev + 1) % topics.length);

      if (step < totalSteps) {
        const speed = Math.min(50 + step * 8, 250);

        setTimeout(roll, speed);
      } else {
        setRolling(false);
      }
    };

    roll();
  };

  return (
<section className="mt-8 flex flex-col items-center">
      <RollingWheel
        topics={topics}
        currentIndex={currentIndex}
      />

      <button
        onClick={handleRoll}
        disabled={rolling}
        className="
          mt-3
          rounded-full
          border
          border-zinc-300
          bg-white
          px-6
          py-3
          text-sm
          font-medium
          transition-all
          hover:scale-[1.02]
          hover:bg-zinc-50
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {rolling ? "Rolling..." : "🎲 Roll Topic"}
      </button>
    </section>
  );
}