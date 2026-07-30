import { useEffect, useRef } from "react";

type Props = {
  liveTranscript: string;
  showTranscript: boolean;
  onToggle: () => void;
  isListening: boolean;
};

export default function TranscriptPanel({
  liveTranscript,
  showTranscript,
  onToggle,
  isListening,
}: Props) {
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptContainerRef.current?.scrollTo({
      top: transcriptContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [liveTranscript]);

  return (
    <div
      className={`h-full shrink-0 overflow-hidden border-l border-zinc-100/70 transition-all duration-300 ease-out ${
        showTranscript ? "w-[320px]" : "w-0"
      }`}
    >
      <div className="flex h-full w-full flex-col px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[14px] font-semibold text-zinc-800">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7C6CF8"
              strokeWidth="2"
            >
              <path
                d="M4 12h2l2-7 3 14 2-9 2 4h5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Live Transcript
          </div>

          <button
            onClick={onToggle}
            className="text-zinc-400 transition hover:text-zinc-700"
          >
            ✕
          </button>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {isListening ? "Listening..." : "Stand by"}
        </div>

        <div ref={transcriptContainerRef} className="mt-3 flex-1 overflow-y-auto text-[13px] leading-6">
          {!liveTranscript ? (
            <div>Your speech will appear here...</div>
          ) : (
            <p>{liveTranscript}</p>
          )}
        </div>

        <div className="mt-2 flex h-6 items-end gap-[2px] opacity-50">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="w-[2px] rounded-full bg-[#7C6CF8]"
              style={{ height: `${4 + ((i * 7) % 16)}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
