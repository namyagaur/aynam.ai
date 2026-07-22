import { FILLER_WORDS } from "./constants";
import { tokenize } from "./tokenizer";
import { FillerMetrics, FillerWord } from "./types";

/**
 * Detects filler words in a transcript.
 */
export function analyzeFillers(
  transcript: string
): FillerMetrics {

  const lowerCaseTranscript = transcript.toLowerCase();

  const fillerWords: FillerWord[] = [];
  let total = 0;

  for (const filler of FILLER_WORDS) {

    const regex = new RegExp(`\\b${filler}\\b`, "g");

    const matches = lowerCaseTranscript.match(regex);

    const count = matches?.length ?? 0;

    if (count > 0) {
      fillerWords.push({
        word: filler,
        count,
      });

      total += count;
    }
  }

  const totalWords = tokenize(transcript).length;

  const density =
    totalWords === 0
      ? 0
      : Number(((total / totalWords) * 100).toFixed(2));

  return {
    total,
    density,
    words: fillerWords,
  };
}