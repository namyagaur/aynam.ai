"use client";

type ModeChipProps = {
  title: string;
  icon: React.ElementType;
  selected?: boolean;
  onClick?: () => void;
};

export default function ModeChip({
  title,
  icon: Icon,
  selected,
  onClick,
}: ModeChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        h-[52px]
        rounded-2xl
        border
        px-5
        transition-all
        duration-300

        ${
          selected
            ? `
              border-[#DDD5FF]
              bg-[linear-gradient(180deg,#FFFEFF_0%,#F7F4FF_100%)]
              shadow-[0_6px_18px_rgba(108,99,255,.06)]
            `
            : `
              border-[#EFEAE4]
              bg-white
              hover:bg-[#FCFBFF]
              hover:border-[#E5DFFF]
            `
        }
      `}
    >
      <div className="flex h-full items-center gap-2.5">

        <Icon
          size={17}
          strokeWidth={2}
          className={`
            transition-colors
            ${
              selected
                ? "text-[#6C63FF]"
                : "text-[#8B8893] group-hover:text-[#6C63FF]"
            }
          `}
        />

        <span
          className={`
            text-[14px]
            font-medium
            transition-colors

            ${
              selected
                ? "text-[#25232D]"
                : "text-[#4F4B58]"
            }
          `}
        >
          {title}
        </span>

      </div>

      {selected && (
        <div
          className="
            absolute
            -bottom-3
            left-1/2
            h-1.5
            w-1.5
            -translate-x-1/2
            rounded-full
            bg-[#6C63FF]
          "
        />
      )}
    </button>
  );
}