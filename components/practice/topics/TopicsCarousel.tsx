"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import TopicCard from "./TopicCard";

const topics = [
  "Describe a time you had to give someone difficult feedback.",
  "Tell me about a project that didn't go as planned.",
  "If you were hiring for your role, what qualities would you look for?",
  "Talk about a time you stepped out of your comfort zone.",
  "How do you deal with rejection or setbacks?",
];

export default function TopicsCarousel() {
  return (
    <div className="relative mt-6">

      {/* Left Arrow */}

      <button
        className="
          absolute
          left-[-22px]
          top-[72px]
          z-20
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-[#ECE8E2]
          bg-white
          shadow-lg
        "
      >
        <ChevronLeft size={18} />
      </button>

      {/* Cards */}

      <div className="flex gap-4 overflow-hidden">

        {topics.map((topic, index) => (
          <TopicCard
            key={topic}
            title={topic}
            selected={index === 2}
          />
        ))}

      </div>

      {/* Right Arrow */}

      <button
        className="
          absolute
          right-[-22px]
          top-[72px]
          z-20
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-[#ECE8E2]
          bg-white
          shadow-lg
        "
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}

      <div className="mt-7 flex justify-center gap-2">

        <div className="h-2 w-2 rounded-full bg-[#DDD8EA]" />
        <div className="h-2 w-2 rounded-full bg-[#DDD8EA]" />
        <div className="h-2 w-2 rounded-full bg-[#7B5CFA]" />
        <div className="h-2 w-2 rounded-full bg-[#DDD8EA]" />
        <div className="h-2 w-2 rounded-full bg-[#DDD8EA]" />

      </div>

    </div>
  );
}