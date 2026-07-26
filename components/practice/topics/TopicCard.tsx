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
        h-[196px]
        w-[176px]
        shrink-0
        rounded-[24px]
        border
        bg-white
        transition-all
        duration-300
        ${
          selected
            ? "border-[#8B6CFF] shadow-[0_12px_30px_rgba(119,86,255,.08)]"
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
            px-3
            py-1
            text-[10px]
            font-semibold
            tracking-[0.12em]
            text-white
          "
        >
          SELECTED
        </div>
      )}

      <div className="flex h-full flex-col justify-between p-6">
        <p
          className="
            mt-5
            text-center
            text-[20px]
            font-medium
            leading-8
            text-[#222]
          "
        >
          {title}
        </p>

        <div className="flex items-center justify-center gap-2 text-[#7B7882]">
          <span>🕒</span>

          <span className="text-[14px]">
            5–7 min
          </span>
        </div>
      </div>
    </div>
  );
}