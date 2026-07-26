"use client";

import { useState } from "react";
import TopicRow from "./TopicRow";
import { publicSpeakingTopics } from "../data/topics";

export default function TopicGenerator() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [rolling, setRolling] = useState(false);

  const getTopic = (offset: number) => {
    const length = publicSpeakingTopics.length;
    return publicSpeakingTopics[
      (currentIndex + offset + length) % length
    ];
  };

  const handleRoll = () => {
    if (rolling) return;

    setRolling(true);

    const next = Math.floor(
      Math.random() * publicSpeakingTopics.length
    );

    setTimeout(() => {
      setCurrentIndex(next);
      setRolling(false);
    }, 400);
  };

  return (
    <section className="mt-10 flex flex-col items-center">

      <div className="w-full max-w-xl">

        <div className="border-t border-zinc-200 py-4">

          <TopicRow topic={getTopic(-2)} />

          <TopicRow topic={getTopic(-1)} />

          <TopicRow topic={getTopic(0)} selected />

          <TopicRow topic={getTopic(1)} />

          <TopicRow topic={getTopic(2)} />

        </div>

        <div className="border-b border-zinc-200" />

      </div>

      <button
        onClick={handleRoll}
        disabled={rolling}
        className="mt-6 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium transition hover:bg-zinc-100 disabled:opacity-50"
      >
        {rolling ? "Rolling..." : "🎲 Roll Topic"}
      </button>

    </section>
  );
}