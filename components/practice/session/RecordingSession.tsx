"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [showTranscript, setShowTranscript] = useState(false);
  const engine = useRecordingEngine(duration);
  const isFinished = engine.recordingState === "finished";
  const [isFinishing, setIsFinishing] = useState(false);
  const finishingRef = useRef(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [showEmptyTranscriptDialog, setShowEmptyTranscriptDialog] = useState(false);

  const endAndReturnToPractice = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsFinishing(true);
    try {
      await engine.finishRecording();
      onEnd();
    } catch (error) {
      finishingRef.current = false;
      setIsFinishing(false);
      setFinishError(error instanceof Error ? error.message : "Unable to end this session.");
    }
  };

  const finishAndOpenReview = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsFinishing(true);
    setFinishError(null);
    try {
      const completed = await engine.finishRecording();
      if (!completed.transcript.trim()) {
        finishingRef.current = false;
        setIsFinishing(false);
        setShowEmptyTranscriptDialog(true);
        return;
      }
      const reviewInput = {
        transcript: completed.transcript,
        topic,
        durationSeconds: completed.elapsedDurationSeconds,
        elapsedDurationSeconds: completed.elapsedDurationSeconds,
        speakingDurationSeconds: completed.speakingDurationSeconds,
      };
      sessionStorage.setItem("session-review-input", JSON.stringify(reviewInput));
      router.push("/session/review");
    } catch (error) {
      finishingRef.current = false;
      setIsFinishing(false);
      setFinishError(error instanceof Error ? error.message : "Unable to finish this session.");
    }
  };

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
          <button onClick={() => void endAndReturnToPractice()} disabled={isFinishing} className="text-[13px] text-[var(--theme-text-muted)] transition hover:text-[var(--theme-text)] disabled:opacity-60">
            ← End Session
          </button>

          <button
            onClick={() => setShowTranscript((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
              showTranscript
                ? "border-[var(--theme-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]"
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

        <h1 className="mt-4 max-w-2xl text-center text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--theme-primary)]">
          {topic}
        </h1>

        <p className="mt-2 text-[15px] text-[var(--theme-text-muted)]">Speak naturally. There is no right or wrong answer.</p>

        <div className="mt-5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-accent-soft)] px-3.5 py-1 text-[12px] font-medium text-[var(--theme-accent)]">
          {duration} min session
        </div>

        <Timer secondsLeft={engine.secondsLeft} durationMinutes={duration} recordingState={engine.recordingState} />

        <div className="mt-8 flex items-center gap-3">
          {engine.recordingState === "idle" ? (
            <button
              onClick={() => {
                void engine.startRecording();
              }}
              disabled={engine.isStarting}
              className="h-10 w-32 rounded-full bg-[var(--theme-primary)] text-[14px] font-medium text-white shadow-sm transition hover:scale-[1.01]"
            >
              {engine.isStarting ? "Starting..." : "▶ Start"}
            </button>
          ) : (
            <>
              <button
                onClick={engine.recordingState === "paused" ? engine.resumeRecording : engine.pauseRecording}
                className="h-10 w-32 rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] text-[14px] font-medium text-[var(--theme-accent)] shadow-sm transition hover:bg-[var(--theme-accent-soft)]"
              >
                {engine.recordingState === "paused" ? "▶ Resume" : "⏸ Pause"}
              </button>

              <button
                onClick={() => void finishAndOpenReview()}
                disabled={isFinishing}
                className="h-10 w-44 rounded-full bg-[var(--theme-primary)] text-[14px] font-medium text-white shadow-sm transition hover:scale-[1.01]"
              >
                ■ Finish Session
              </button>
            </>
          )}
        </div>

        <p className="mt-4 text-[11px] text-zinc-400">Your recording will be analyzed after finishing.</p>

        <Waveform audioLevel={engine.audioLevel} isSpeaking={engine.isSpeaking} />

        <p className="mt-2 text-[11px] text-zinc-500">{statusMessage}</p>
        {engine.speechRecognitionError ? (
          <p className="mt-1 max-w-md text-center text-[11px] text-amber-600">{engine.speechRecognitionError}</p>
        ) : null}
        {finishError ? <p role="alert" className="mt-2 max-w-md text-center text-xs text-red-600">{finishError}</p> : null}

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
        isListening={engine.isListening}
        transcriptionError={engine.speechRecognitionError}
      />

      {showEmptyTranscriptDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4">
          <section role="dialog" aria-modal="true" aria-labelledby="empty-session-title" className="w-full max-w-sm rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] p-6 text-center shadow-xl">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">?</div>
            <h2 id="empty-session-title" className="mt-4 text-lg font-semibold text-[var(--theme-text)]">No speech captured</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--theme-text-muted)]">It looks like you didn’t say anything in this session. Would you like to try again?</p>
            <button type="button" onClick={() => { setShowEmptyTranscriptDialog(false); engine.reset(); }} className="mt-5 w-full rounded-full bg-[var(--theme-primary)] px-4 py-2.5 text-sm font-medium text-white">Try again</button>
            <button type="button" onClick={() => router.push("/")} className="mt-2 w-full rounded-full bg-[var(--theme-accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--theme-accent)]">No, go Home</button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
