"use client";

import { ChevronRight } from "lucide-react";

type ModeCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  selected?: boolean;
};

export default function ModeCard({
  title,
  description,
  icon: Icon,
  color,
  selected = false,
}: ModeCardProps) {
  return (
    <button
      className={`
        group w-full rounded-[28px] border bg-white
        px-6 py-5 text-left transition-all duration-300

        ${
          selected
            ? "border-[#8B7BFF] shadow-[0_12px_35px_rgba(139,123,255,0.12)]"
            : "border-[#ECE8E2] hover:border-[#DDD6FE] hover:shadow-lg"
        }
      `}
    >
      <div className="flex items-center">

        {/* Icon */}

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}
        >
          <Icon
            size={26}
            strokeWidth={2}
            className="text-[#4F46E5]"
          />
        </div>

        {/* Content */}

        <div className="ml-5 flex-1">

          <h3 className="text-[22px] font-semibold text-[#23232B]">
            {title}
          </h3>

          <p className="mt-1 text-[15px] leading-6 text-[#6D6D75]">
            {description}
          </p>

        </div>

        {/* Arrow */}

        <ChevronRight
          size={22}
          className={`transition ${
            selected
              ? "text-[#7C6BFF]"
              : "text-[#A5A5AE] group-hover:text-[#7C6BFF]"
          }`}
        />

      </div>
    </button>
  );
}