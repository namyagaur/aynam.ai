type TopicRowProps = {
  topic: string;
  selected?: boolean;
};

export default function TopicRow({
  topic,
  selected = false,
}: TopicRowProps) {
  return (
    <div
      className={`flex h-11 items-center justify-center px-8 text-center transition-all duration-300 ${
        selected
          ? "text-xl font-semibold text-zinc-900"
          : "text-[15px] text-zinc-400"
      }`}
    >
      {topic}
    </div>
  );
}