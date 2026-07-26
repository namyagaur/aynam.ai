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
    <div className="relative mt-3">

      {/* Left Arrow */}

      <button
        className="
          absolute
          left-[-14px]
          top-[72px]
          z-20
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-[#ECE8E2]
          bg-white
          shadow-sm
        "
      >
        <ChevronLeft size={16} />
      </button>

      {/* Cards */}

      <div className="flex justify-center gap-3 overflow-hidden px-4">

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
          right-[-14px]
          top-[72px]
          z-20
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-[#ECE8E2]
          bg-white
          shadow-sm
        "
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots */}

      <div className="mt-5 flex justify-center gap-1.5">

        <div className="h-1.5 w-1.5 rounded-full bg-[#DDD8EA]" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#DDD8EA]" />
        <div className="h-2 w-2 rounded-full bg-[#7B5CFA]" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#DDD8EA]" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#DDD8EA]" />

      </div>

    </div>
  );
}