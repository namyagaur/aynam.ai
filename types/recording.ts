export type RecordingState = "idle" | "recording" | "paused" | "finished";

export interface RecordingEngineState {
  recordingState: RecordingState;
  secondsLeft: number;
  audioUrl: string | null;
  audioLevel: number;
  isSpeaking: boolean;
  isSilent: boolean;
  transcript: TranscriptSegment[];
  error: string | null;
  isStarting: boolean;
}

import type { TranscriptSegment } from "./transcript";
