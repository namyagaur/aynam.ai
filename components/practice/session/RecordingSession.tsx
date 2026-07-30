"use client";

import { useMemo, useState } from "react";
import { useRecordingEngine } from "@/hooks/useRecordingEngine";
import Timer from "./Timer";
import TranscriptPanel from "./TranscriptPanel";
import Waveform from "./Waveform";

type Props = {
  topic: string;
  duration: number;
  onEnd: () => void;
};

export default function RecordingSession({ topic, duration, onEnd }: Props) {
  const [showTranscript, setShowTranscript] = useState(false);
  const engine = useRecordingEngine(duration);
  const isFinished = engine.recordingState === "finished";
  const isRecording = engine.recordingState === "recording";

  const statusMessage = useMemo(() => {
    if (engine.error) {
      return engine.error;
    }

    if (engine.recordingState === "recording") {
      return "Recording...";
    }

    if (engine.recordingState === "paused") {
      return "Paused";
    }

    if (engine.recordingState === "finished") {
      return "Finished";
    }

    return "Ready";
  }, [engine.error, engine.recordingState]);

  return (
    <div className="flex w-full min-h-0 overflow-hidden">
      <div className="flex flex-1 flex-col items-center px-10 pt-2 pb-4 transition-all duration-300 ease-out">
        <div className="mb-6 flex w-full max-w-3xl items-center justify-between">
          <button onClick={onEnd} className="text-[13px] text-zinc-500 transition hover:text-zinc-900">
            ← End Session
          </button>

          <button
            onClick={() => setShowTranscript((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
              showTranscript
                ? "border-[#ECE9FF] bg-[#F7F5FF] text-[#6759E8]"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16" />
            </svg>
            Live Transcript
            <span className="ml-0.5 text-[11px] text-zinc-400">⌘T</span>
          </button>
        </div>

        <h1 className="mt-4 max-w-2xl text-center text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#6B63F6]">
          {topic}
        </h1>

        <p className="mt-2 text-[15px] text-zinc-500">Speak naturally. There is no right or wrong answer.</p>

        <div className="mt-5 rounded-full border border-[#ECE9FF] bg-[#F7F6FF] px-3.5 py-1 text-[12px] font-medium text-[#6B63F6]">
          {duration} min session
        </div>

        <Timer secondsLeft={engine.secondsLeft} durationMinutes={duration} recordingState={engine.recordingState} />

        <div className="mt-8 flex items-center gap-3">
          {engine.recordingState === "idle" || engine.recordingState === "finished" ? (
            <button
              onClick={() => {
                void engine.startRecording();
              }}
              disabled={engine.isStarting}
              className="h-10 w-32 rounded-full bg-[#6B63F6] text-[14px] font-medium text-white shadow-[0_10px_20px_rgba(107,99,246,.2)] transition hover:scale-[1.01]"
            >
              {engine.isStarting ? "Starting..." : "▶ Start"}
            </button>
          ) : (
            <>
              <button
                onClick={engine.recordingState === "paused" ? engine.resumeRecording : engine.pauseRecording}
                className="h-10 w-32 rounded-full border border-zinc-200 bg-white text-[14px] font-medium text-[#6759E8] shadow-sm transition hover:bg-zinc-50"
              >
                {engine.recordingState === "paused" ? "▶ Resume" : "⏸ Pause"}
              </button>

              <button
                onClick={engine.finishRecording}
                className="h-10 w-44 rounded-full bg-[#6B63F6] text-[14px] font-medium text-white shadow-[0_10px_20px_rgba(107,99,246,.2)] transition hover:scale-[1.01]"
              >
                ■ Finish Session
              </button>
            </>
          )}
        </div>

        <p className="mt-4 text-[11px] text-zinc-400">Your recording will be analyzed after finishing.</p>

        <Waveform audioLevel={engine.audioLevel} isSpeaking={engine.isSpeaking} />

        <p className="mt-2 text-[11px] text-zinc-500">{statusMessage}</p>

        {isFinished && engine.audioUrl ? (
          <>
            <p className="mb-2 text-center text-[12px] font-medium text-zinc-500">Recording Preview</p>
            <audio controls src={engine.audioUrl} className="w-full" />
          </>
        ) : null}
      </div>

      <TranscriptPanel
        liveTranscript={engine.liveTranscript}
        showTranscript={showTranscript}
        onToggle={() => setShowTranscript(false)}
        isListening={isRecording}
      />
    </div>
  );
}
