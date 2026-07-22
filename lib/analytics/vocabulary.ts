import { STOP_WORDS } from "./constants";
import { tokenize } from "./tokenizer";
import { VocabularyMetrics, RepeatedWord } from "./types";

/**
 * Finds the most repeated meaningful words.
 */
function findRepeatedWords(words: string[]): RepeatedWord[] {
  const frequency: Record<string, number> = {};

  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;

    frequency[word] = (frequency[word] || 0) + 1;
  }

  return Object.entries(frequency)
    .filter(([, count]) => count > 2)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({
      word,
      count,
    }))
    .slice(0, 10);
}

/**
 * Calculates average word length.
 */
function averageWordLength(words: string[]): number {
  if (words.length === 0) return 0;

  const totalCharacters = words.reduce(
    (sum, word) => sum + word.length,
    0
  );

  return Number((totalCharacters / words.length).toFixed(1));
}

/**
 * Generates vocabulary analytics.
 */
export function analyzeVocabulary(
  transcript: string
): VocabularyMetrics {

  const words = tokenize(transcript);

  const uniqueWords = new Set(words).size;

  const vocabularyRichness =
    words.length === 0
      ? 0
      : Number((uniqueWords / words.length).toFixed(2));

  return {
    uniqueWords,
    vocabularyRichness,
    averageWordLength: averageWordLength(words),
    repeatedWords: findRepeatedWords(words),
  };
}