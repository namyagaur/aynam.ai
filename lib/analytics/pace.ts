import { PaceMetrics } from "./types";
import { SPEAKING_PACE } from "./constants";
import { countWords } from "./tokenizer";

/**
 * Calculates Words Per Minute.
 */
function calculateWPM(
  wordCount: number,
  durationSeconds: number
): number {
  if (durationSeconds <= 0) return 0;

  return Math.round(wordCount / (durationSeconds / 60));
}

/**
 * Converts WPM into a human-readable category.
 */
function classifySpeakingPace(
  wpm: number
): PaceMetrics["speakingPace"] {
  if (wpm < SPEAKING_PACE.VERY_SLOW) return "Very Slow";
  if (wpm < SPEAKING_PACE.SLOW) return "Slow";
  if (wpm <= SPEAKING_PACE.NORMAL) return "Normal";
  if (wpm <= SPEAKING_PACE.FAST) return "Fast";

  return "Very Fast";
}

/**
 * Generates complete pace analytics.
 */
export function analyzePace(
  transcript: string,
  durationSeconds: number
): PaceMetrics {

  const wordCount = countWords(transcript);

  const wordsPerMinute = calculateWPM(
    wordCount,
    durationSeconds
  );

  return {
    durationSeconds,
    wordsPerMinute,
    speakingPace: classifySpeakingPace(wordsPerMinute),
  };
}