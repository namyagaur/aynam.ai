type Props = {
  secondsLeft: number;
  durationMinutes: number;
  recordingState: "idle" | "recording" | "paused" | "finished";
};

export default function Timer({ secondsLeft, durationMinutes, recordingState }: Props) {
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const formattedTime = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  const totalSeconds = durationMinutes * 60;
  const elapsed = totalSeconds - secondsLeft;
  const progressDeg = totalSeconds > 0 ? (elapsed / totalSeconds) * 360 : 0;

  const status = recordingState === "recording" ? "Recording..." : recordingState === "paused" ? "Paused" : recordingState === "finished" ? "Finished" : "Ready";

  return (
    <div
      className="relative mt-7 aspect-square w-[170px] shrink-0 rounded-full"
      style={{
        background: `conic-gradient(#7C6CF8 ${progressDeg}deg, #E5E7EB ${progressDeg}deg)`,
      }}
    >
      <div className="absolute inset-[3px] flex flex-col items-center justify-center rounded-full border border-dashed border-zinc-200 bg-white shadow-[0_12px_30px_rgba(0,0,0,.04)]">
        <div className="text-center">
          <div className="text-[30px] font-semibold text-zinc-900">{formattedTime}</div>
          <div className="mt-0.5 text-[11px] text-zinc-400">of {String(durationMinutes).padStart(2, "0")}:00</div>
          <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-red-500">
            <span className={`h-1.5 w-1.5 rounded-full bg-red-500 ${recordingState === "recording" ? "" : "opacity-40"}`} />
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}
