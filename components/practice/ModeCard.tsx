"use client";

import { ChevronRight } from "lucide-react";

type ModeCardProps = {
  title: string;
  icon: React.ElementType;
  color: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function ModeCard({
  title,
  icon: Icon,
  color,
  selected = false,
  onClick,
}: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        flex
        h-[66px]
        w-full
        items-center
        rounded-[18px]
        border
        px-3.5
        transition-all
        duration-200

        ${
          selected
            ? "border-[#8C7CFF] bg-white shadow-[0_6px_18px_rgba(110,100,255,.08)]"
            : "border-[#F2EEE9] bg-[#FFFEFC] hover:border-[#DDD5FF] hover:bg-white"
        }
      `}
    >
      {/* Icon */}

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: color,
        }}
      >
        <Icon
          size={17}
          strokeWidth={2}
          className="text-[#5B5CEB]"
        />
      </div>

      {/* Title */}

      <span
        className="
          ml-3
          flex-1
          text-left
          text-[15px]
          font-medium
          text-[#26242C]
        "
      >
        {title}
      </span>

      {/* Arrow */}

      <ChevronRight
        size={16}
        strokeWidth={2}
        className={`transition-colors ${
          selected
            ? "text-[#7C6CFF]"
            : "text-[#BBB7C3] group-hover:text-[#7C6CFF]"
        }`}
      />
    </button>
  );
}