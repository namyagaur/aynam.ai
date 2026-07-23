import {
  CONFIDENT_WORDS,
  HESITATION_WORDS,
} from "./constants";

import { ConfidenceMetrics } from "./types";

function countMatches(
  text: string,
  phrases: string[]
): number {

  let total = 0;

  for (const phrase of phrases) {

    const regex = new RegExp(`\\b${phrase}\\b`, "g");

    const matches = text.match(regex);

    total += matches?.length ?? 0;
  }

  return total;
}

export function analyzeConfidence(
  transcript: string
): ConfidenceMetrics {

  const text = transcript.toLowerCase();

  const hesitationCount = countMatches(
    text,
    HESITATION_WORDS
  );

  const confidentWordCount = countMatches(
    text,
    CONFIDENT_WORDS
  );

  let score = 70;

  score += confidentWordCount * 5;

  score -= hesitationCount * 5;

  score = Math.max(0, Math.min(100, score));

  return {
    hesitationCount,
    confidentWordCount,
    score,
  };
}