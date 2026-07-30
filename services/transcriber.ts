import { RecordingConfig } from "@/config/recording";
import type { TranscriptSegment } from "@/types/transcript";

export interface SpeechResult {
  transcript: TranscriptSegment[];
}

export interface TranscriptionOptions {
  start?: number;
  end?: number;
  chunkIndex?: number;
  filename?: string;
  signal?: AbortSignal;
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function getBlobDuration(audio: Blob): Promise<number> {
  if (typeof window === "undefined") {
    return 0;
  }

  const audioUrl = URL.createObjectURL(audio);

  try {
    return await new Promise<number>((resolve) => {
      const audioElement = new Audio(audioUrl);

      audioElement.onloadedmetadata = () => {
        resolve(Number.isFinite(audioElement.duration) ? audioElement.duration : 0);
      };

      audioElement.onerror = () => {
        resolve(0);
      };
    });
  } finally {
    URL.revokeObjectURL(audioUrl);
  }
}

export async function transcribeAudio(
  audio: Blob,
  options: TranscriptionOptions = {}
): Promise<SpeechResult> {
  const filename = options.filename ?? "recording.webm";
  const formData = new FormData();

  formData.append("file", audio, filename);

  const duration = await getBlobDuration(audio);
  console.info("[transcribe] preparing upload", {
    mimeType: audio.type || "unknown",
    blobType: audio.type || "unknown",
    blobSize: audio.size,
    duration,
    filename,
    contentType: "multipart/form-data",
  });

  let lastError: unknown;

  for (let attempt = 0; attempt <= RecordingConfig.maxChunkRetries; attempt += 1) {
    if (options.signal?.aborted) {
      throw new DOMException("The transcription request was aborted.", "AbortError");
    }

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
        signal: options.signal,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("[speech] API response:", data);
      const transcriptText = typeof data?.transcript === "string" ? data.transcript : "";

      console.log("[speech] transcript text:", transcriptText);
      return {
        transcript: [
          {
            id: `segment-${options.chunkIndex ?? crypto.randomUUID()}`,
            text: transcriptText,
            start: options.start ?? 0,
            end: options.end ?? 0,
            chunkIndex: options.chunkIndex,
            status: "completed",
            provider: "groq",
            createdAt: new Date().toISOString(),
          },
        ],
      };
    } catch (error) {
      lastError = error;

      if (options.signal?.aborted || attempt >= RecordingConfig.maxChunkRetries) {
        break;
      }

      const backoffMs = Math.min(
        RecordingConfig.retryMaxDelayMs,
        RecordingConfig.retryBaseDelayMs * 2 ** attempt
      );
      await delay(backoffMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to transcribe audio chunk.");
}
