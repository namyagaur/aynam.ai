"use client";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const marks = [
  { value: 1, angle: 225 },
  { value: 5, angle: 292.5 },
  { value: 10, angle: 360 },
  { value: 15, angle: 67.5 },
  { value: 20, angle: 135 },
];
export default function DurationKnob({
  value,
}: Props) {
  return (
  <div className="flex flex-col items-center">

    

    <div className="relative h-[340px] w-[340px]">
      {marks.map((mark) => {
  const radius = 158;

  const rad = (mark.angle * Math.PI) / 180;

const x = 170 + radius * Math.cos(rad);
const y = 170 - radius * Math.sin(rad);

  return (
    <div
      key={mark.value}
      className={`absolute -translate-x-1/2 -translate-y-1/2
      ${
        value === mark.value
          ? "text-[#7C6CF8] font-bold text-xl"
          : "text-zinc-400"
      }`}
      style={{
        left: x,
        top: y,
      }}
    >
      {mark.value}
    </div>
  );
})}
      <svg
        className="absolute inset-0"
        width="340"
        height="340"
        viewBox="0 0 340 340"
      >
        <path
          d="
            M 85 255
            A 120 120 0 1 1 255 255
          "
          fill="none"
          stroke="#E9E4FF"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-40
          w-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          flex
          flex-col
          items-center
          justify-center
        "
      >
        <span className="text-5xl font-semibold text-[#7C6CF8]">
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

function durationToWords(minutes: number) {
  return Math.round(minutes * 140);
}