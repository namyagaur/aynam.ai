"use client";

type DurationKnobProps = {
  value: number;
};

export default function DurationKnob({
  value,
}: DurationKnobProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="
          relative
          flex
          h-72
          w-72
          items-center
          justify-center
          rounded-full
          border
          border-zinc-200
          bg-white
          shadow-[0_20px_60px_rgba(124,108,248,0.08)]
        "
      >
        {/* outer ring */}
        <div
          className="
            absolute
            inset-3
            rounded-full
            border-4
            border-[#7C6CF8]/20
          "
        />

        {/* center */}
        <div
          className="
            flex
            h-44
            w-44
            flex-col
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-lg
          "
        >
          <span className="text-6xl font-semibold text-[#7C6CF8]">
            {value}
          </span>

          <span className="text-zinc-500">
            min
          </span>
        </div>
      </div>
    </div>
  );
}