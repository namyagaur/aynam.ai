export type TranscriptStatus = "pending" | "processing" | "completed" | "failed";

export interface TranscriptSegment {
  id: string;
  text: string;
  start: number;
  end: number;
  chunkIndex?: number;
  status?: TranscriptStatus;
  confidence?: number;
  provider?: string;
  createdAt?: string;
  audioStartOffset?: number;
}
