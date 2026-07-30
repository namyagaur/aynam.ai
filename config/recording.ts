export const RecordingConfig = {
  chunkDurationMs: 2000,
  audioLevelSmoothing: 0.85,
  silenceThreshold: 0.04,
  silenceDurationMs: 600,
  speakingDurationMs: 200,
  maxChunkRetries: 3,
  retryBaseDelayMs: 500,
  retryMaxDelayMs: 4000,
} as const;
