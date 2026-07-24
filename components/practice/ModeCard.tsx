"use client";

import { ChevronRight } from "lucide-react";

type ModeCardProps = {
  title: string;
  icon: React.ElementType;
  color: string;
  selected?: boolean;
};

export default function ModeCard({
  title,
  icon: Icon,
  color,
  selected = false,
}: ModeCardProps) {
  return (
    <button
      className={`
      group
      flex
      h-[84px]
      w-full
      items-center
      rounded-[20px]
      border
      bg-white
      px-4
      transition-all
      duration-300

      ${
        selected
          ? "border-[#8C7AFF] shadow-[0_8px_30px_rgba(125,110,255,0.08)]"
          : "border-[#ECE8E2] hover:border-[#D7CFFF]"
      }
    `}
    >
      {/* icon */}

      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: color,
        }}
      >
        <Icon
          size={18}
          strokeWidth={2}
          className="text-[#4A47D5]"
        />
      </div>

      {/* text */}

      <div className="ml-4 flex-1">
<h3 className="text-[16px] font-semibold text-[#24232B]">
  {title}
</h3>
      </div>

      <ChevronRight
        size={18}
        className={`transition ${
          selected
            ? "text-[#7C6BFF]"
            : "text-[#B6B4BC] group-hover:text-[#7C6BFF]"
        }`}
      />
    </button>
  );
}