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
        relative
        flex
        h-[72px]
        w-full
        items-center
        rounded-[20px]
        border
        px-4
        transition-all
        duration-300

        ${
          selected
            ? "border-[#8C7CFF] bg-white shadow-[0_8px_24px_rgba(110,100,255,0.08)]"
            : "border-[#F0ECE6] bg-[#FFFEFC] hover:border-[#DDD5FF] hover:bg-white"
        }
      `}
    >
      {/* Icon */}

      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: color,
        }}
      >
        <Icon
          size={18}
          strokeWidth={2}
          className="text-[#4D55E8]"
        />
      </div>

      {/* Title */}

      <span
        className="
          ml-4
          flex-1
          text-left
          text-[15px]
          font-semibold
          text-[#2A2932]
        "
      >
        {title}
      </span>

      {/* Arrow */}

      <ChevronRight
        size={18}
        strokeWidth={2}
        className={`
          transition-colors

          ${
            selected
              ? "text-[#7C6CFF]"
              : "text-[#B6B3BD] group-hover:text-[#7C6CFF]"
          }
        `}
      />
    </button>
  );
}