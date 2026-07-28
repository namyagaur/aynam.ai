type Props = {
  topic: string;
  selected?: boolean;
  opacity: number;
};

export default function TopicRow({
  topic,
  selected = false,
  opacity,
}: Props) {
  return (
    <div
      style={{ opacity: opacity / 100 }}
      className={`
        flex
        h-12
        items-center
        px-6
        transition-all
        duration-300
        ${
          selected
            ? "scale-100"
            : "scale-[0.95]"
        }
      `}
    >
      <p
  className={`
    line-clamp-2
    leading-snug
    ${
      selected
        ? "text-base font-semibold text-zinc-900"
        : "text-sm text-zinc-500"
    }
  `}
>
        {topic}
      </p>
    </div>
  );
}