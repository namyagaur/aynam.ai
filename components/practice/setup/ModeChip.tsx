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
              border-[var(--theme-border)]
              bg-[linear-gradient(180deg,var(--theme-surface-elevated)_0%,var(--theme-primary-soft)_100%)]
              shadow-[0_6px_18px_rgba(108,99,255,.06)]
            `
            : `
              border-[var(--theme-border)]
              bg-white
              hover:bg-[var(--theme-surface)]
              hover:border-[var(--theme-border)]
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
                ? "text-[var(--theme-primary)]"
                : "text-[var(--theme-text-muted)] group-hover:text-[var(--theme-primary)]"
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
                ? "text-[var(--theme-text)]"
                : "text-[var(--theme-text-muted)]"
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
            bg-[var(--theme-primary)]
          "
        />
      )}
    </button>
  );
}
