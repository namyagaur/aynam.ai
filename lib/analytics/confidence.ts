import {
  CONFIDENT_WORDS,
  HESITATION_WORDS,
} from "./constants";

import {
  ConfidenceMetrics,
  ConfidenceWord,
} from "./types";

function findWords(
  text: string,
  phrases: string[]
): ConfidenceWord[] {

  const result: ConfidenceWord[] = [];

  for (const phrase of phrases) {

    const regex = new RegExp(`\\b${phrase}\\b`, "g");

    const matches = text.match(regex);

    const count = matches?.length ?? 0;

    if (count > 0) {
      result.push({
        word: phrase,
        count,
      });
    }
  }

  return result;
}

export function analyzeConfidence(
  transcript: string
): ConfidenceMetrics {

  const text = transcript.toLowerCase();

  return {
    hesitationWords: findWords(
      text,
      HESITATION_WORDS
    ),

    confidentWords: findWords(
      text,
      CONFIDENT_WORDS
    ),
  };
}