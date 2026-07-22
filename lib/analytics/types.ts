export interface RepeatedWord {
  word: string;
  count: number;
}

export interface FillerWord {
  word: string;
  count: number;
}

export interface VocabularyMetrics {
  uniqueWords: number;
  vocabularyRichness: number;
  averageWordLength: number;
  repeatedWords: RepeatedWord[];
}

export interface SentenceMetrics {
  sentenceCount: number;
  averageSentenceLength: number;
  longestSentence: number;
  shortestSentence: number;
}

export interface PaceMetrics {
  durationSeconds: number;
  wordsPerMinute: number;
  speakingPace: "Very Slow" | "Slow" | "Normal" | "Fast" | "Very Fast";
}

export interface FillerMetrics {
  total: number;
  density: number;
  words: FillerWord[];
}

export interface BasicMetrics {
  wordCount: number;
  characterCount: number;
}

export interface SpeechAnalytics {
  basic: BasicMetrics;

  pace: PaceMetrics;

  vocabulary: VocabularyMetrics;

  sentences: SentenceMetrics;

  fillers: FillerMetrics;

  analyticsSummary: string;
}