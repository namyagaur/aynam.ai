type TopicCardProps = {
  title: string;
  selected?: boolean;
};

export default function TopicCard({
  title,
  selected = false,
}: TopicCardProps) {
  return (
    <div
      className={`
        relative
        h-[165px]
        w-[145px]
        shrink-0
        rounded-[20px]
        border
        bg-white
        transition-all
        duration-300
        ${
          selected
            ? "border-[#8B6CFF] shadow-[0_8px_20px_rgba(119,86,255,.08)]"
            : "border-[#ECE8E2]"
        }
      `}
    >
      {selected && (
        <div
          className="
            absolute
            left-1/2
            top-0
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#7C5CFA]
            px-2.5
            py-[3px]
            text-[9px]
            font-semibold
            tracking-[0.10em]
            text-white
          "
        >
          SELECTED
        </div>
      )}

      <div className="flex h-full flex-col justify-between p-4">

        <p
          className="
            mt-3
            text-center
            text-[15px]
            font-medium
            leading-6
            text-[#26242C]
          "
        >
          {title}
        </p>

        <div className="flex items-center justify-center gap-1 text-[#87838C]">

          <span className="text-[12px]">
            🕒
          </span>

          <span className="text-[12px]">
            5–7 min
          </span>

        </div>

      </div>

    </div>
  );
}