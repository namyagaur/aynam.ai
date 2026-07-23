import { splitSentences, tokenize } from "./tokenizer";
import { SentenceMetrics } from "./types";

export function analyzeSentences(
  transcript: string
): SentenceMetrics {

  const sentences = splitSentences(transcript);

  if (sentences.length === 0) {
    return {
      sentenceCount: 0,
      averageSentenceLength: 0,
      longestSentence: 0,
      shortestSentence: 0,
    };
  }

  const sentenceLengths = sentences.map(
    sentence => tokenize(sentence).length
  );

  const totalWords = sentenceLengths.reduce(
    (sum, length) => sum + length,
    0
  );

  return {
    sentenceCount: sentences.length,

    averageSentenceLength: Number(
      (totalWords / sentences.length).toFixed(1)
    ),

    longestSentence: Math.max(...sentenceLengths),

    shortestSentence: Math.min(...sentenceLengths),
  };
}