export const RecordingConfig = {
  chunkDurationMs: 5000,
  audioLevelSmoothing: 0.85,
  silenceThreshold: 0.04,
  silenceDurationMs: 600,
  speakingDurationMs: 200,
  maxChunkRetries: 3,
  retryBaseDelayMs: 500,
  retryMaxDelayMs: 4000,
  minChunkSize: 5000,
  hallucinationFilter: {
    enabled: true,
    patterns: [
      /^\.$/,
      /^thank you\.?$/i,
      /^bye\.?$/i,
      /^okay\.?$/i,
      /^ok\.?$/i,
      /^bye bye\.?$/i,
      /^thank you for watching\.?$/i,
      /^thanks for watching\.?$/i,
    ],
  },
} as const;
