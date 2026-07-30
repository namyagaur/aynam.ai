type Props = {
  audioLevel: number;
  isSpeaking: boolean;
};

export default function Waveform({ audioLevel, isSpeaking }: Props) {
  return (
    <div className="mt-2 flex h-6 items-end gap-[2px] opacity-70">
      {Array.from({ length: 32 }).map((_, index) => {
        const height = 4 + ((index * 7) % 16) + (isSpeaking ? audioLevel * 18 : 0);

        return (
          <span
            key={index}
            className={`w-[2px] rounded-full ${isSpeaking ? "bg-[#7C6CF8]" : "bg-zinc-300"}`}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}
