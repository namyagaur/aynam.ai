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
        h-10
        items-center
        justify-center
        transition-all
        duration-300
        ${
          selected
? "scale-[1.04]"
            : "scale-100"
        }
      `}
    >
      <p
  className={`
    whitespace-nowrap
    overflow-hidden
    text-ellipsis
    transition-all
    duration-300
    ${
      selected
        ? "text-xl font-semibold text-[#6C63FF]"
        : "text-base text-[#A8A1B8]"
    }
  `}
>
        {topic}
      </p>
    </div>
  );
}