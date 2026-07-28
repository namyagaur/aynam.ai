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
  style={{
    opacity: opacity / 100,
    zIndex: selected ? 20 : 1,
  }}
      className={`
        flex
        h-12
        items-center
        px-6
        transition-all
        duration-300
        ${
          selected
  ? "scale-[1.03]"
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
  ? "text-base font-semibold text-violet-700"
        : "text-sm text-zinc-500"
    }
  `}
>
        {topic}
      </p>
    </div>
  );
}